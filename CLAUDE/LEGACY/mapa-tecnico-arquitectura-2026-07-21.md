# Mapa técnico y hoja de ruta de arquitectura — éxodotech

**Origen:** cierre de la misión "Análisis integral del proyecto éxodotech" (arquitectura + aprendizaje guiado de TypeScript), sesión del 2026-07-21.
**Propósito:** este documento es el punto de partida de la siguiente misión — una vez identificados los problemas y decisiones de arquitectura, la próxima misión es implementarlos. Es de solo lectura como referencia; no se edita salvo para corregir algo que quedó mal registrado.

---

## 1. Contexto

Kenny (frontend, viene de Kotlin + Spring Boot en backend, JavaScript + React en `mn-web` sin TypeScript) hizo un repaso guiado de toda la arquitectura de éxodotech con Claude, aprendiendo TypeScript sobre el código real del proyecto. Durante esa sesión se identificaron brechas técnicas, se tomaron decisiones de arquitectura para la siguiente etapa, y se investigaron buenas prácticas actuales (2026) para contrastar contra el proyecto. Éxodotech es un proyecto personal/startup en etapa temprana (Kenny + David), pensado para crecer hacia un ecosistema end-to-end con un backend futuro en Kotlin + Spring Boot organizado por dominios.

Nota de contexto honesta: Kenny hubiera preferido mantener Vite + React Router (herramienta que ya domina), pero acepta Next.js como aprendizaje nuevo — la investigación de mercado 2026 confirma que vale la pena (ver sección 6).

---

## 2. Decisiones de arquitectura tomadas — para implementar en la próxima misión

### 2.1 Migrar de estructura por capas técnicas a estructura por dominio/features

**Qué:** Pasar de la organización actual (`types/index.ts` con todos los tipos juntos, `store/api/exodoApi.ts` con todos los endpoints juntos, `lib/schemas/` con todos los schemas juntos) a una organización por dominio, por ejemplo:

```
features/
├── courses/
│   ├── types.ts
│   ├── api.ts          (endpoints de RTK Query solo de cursos)
│   ├── hooks/
│   └── components/
├── assignments/
│   ├── types.ts
│   ├── api.ts
│   ├── hooks/
│   └── components/
└── submissions/
    └── ...
```

**Por qué (decisión explícita de Kenny):** el plan es construir un ecosistema end-to-end donde el frontend hable el mismo lenguaje de dominios que el backend futuro en Kotlin + Spring Boot, el cual también se organizará por dominios que se comunican entre sí. Kenny prefiere que el frontend ya esté alineado a esa forma de pensar desde ahora, para no migrar forzosamente más adelante bajo presión cuando el proyecto haya crecido.

**Contraste con la buena práctica general investigada:** la recomendación estándar de la industria (Feature-Sliced Design y guías de arquitectura Next.js 2026) es *esperar* a que el dominio crezca (más de 5-6 entidades, o varias personas trabajando features en paralelo) antes de fragmentar así — hacerlo antes se considera sobre-ingeniería prematura para un proyecto con solo 6 entidades (`Course`, `Module`, `Student`, `Assignment`, `Submission`, `TeacherSubmission`). **Kenny decide conscientemente ir contra esa recomendación general**, priorizando la consistencia arquitectónica end-to-end sobre la premura — es una decisión de producto/visión, no un error de juicio técnico.

**Referencia real ya validada en su propio código:** en `mn-web` (`/home/kenny/Proyectos/mn-web`), aunque la organización de alto nivel es por capa técnica (`src/store/`, `src/components/`, `src/hooks/`), *dentro* de cada capa ya agrupa por dominio: `src/store/presupuesto/`, `src/components/presupuesto/`, `src/hooks/presupuesto/`. Es un paso intermedio real entre capas puras y features puras — vale la pena considerarlo como modelo si la migración completa a `features/` resulta muy disruptiva de entrada.

### 2.2 Crear capa de hooks custom (componente → hook → servicio/RTK Query → API)

**Qué:** en vez de que los componentes llamen directamente a los hooks autogenerados de `exodoApi` (ej. `useGetCoursesQuery()`), crear hooks custom por feature que envuelvan esas queries/mutations junto con estado local y lógica de negocio derivada.

**Por qué:** es la dirección de dependencias documentada como buena práctica ("componentes dependen de hooks, hooks dependen de servicios, servicios dependen de APIs, no al revés"). Kenny decide adoptarla desde ya, aunque el proyecto sea chico, para no tener que migrar bajo presión cuando crezca.

**Referencia real ya validada en su propio código:** `useCatalogoPresupuestario.js` en `mn-web` (`src/hooks/presupuesto/useCatalogoPresupuestario.js`) es exactamente este patrón funcionando en producción: envuelve los mutation hooks generados por RTK Query (`useUpdatePartidaPresupuestariaMutation`, etc.) con `.unwrap()` + `try/catch` para manejo de éxito/error, y concentra el estado derivado, dejando el componente de página solo con responsabilidad de orquestación de UI (diálogos, formularios, toasts). Es el molde a replicar en éxodotech.

### 2.3 Colocación de subcomponentes cuando una ruta crece

**Qué:** cuando un `page.tsx` empieza a mezclar responsabilidades y crece mucho (ejemplo real ya detectado: `app/dashboard/teacher/evaluar/[id]/page.tsx`, ~150 líneas, mezcla visor de entrega + formulario de calificación en un solo archivo), dividirlo en subcomponentes que vivan **en la misma carpeta de la ruta** (ej. `evaluar/[id]/GradingForm.tsx`, `evaluar/[id]/SubmissionViewer.tsx`) en vez de moverlos a `components/` genérico o seguir creciendo un solo archivo.

**Por qué:** principio de colocación documentado como la práctica más útil en Next.js App Router 2026 — "todo lo que una ruta necesita vive junto a ella". Es accionable de inmediato, no depende de nada más (ni del backend, ni de la migración a features).

### 2.4 Monorepo / Turborepo — explicado para referencia futura, NO implementar todavía

**Qué es:** una estructura de repositorio único que contiene múltiples aplicaciones y paquetes compartidos, típicamente:

```
apps/
├── web/        (la app Next.js actual)
└── api/        (si hubiera un backend Node/TS separado)
packages/
├── ui/         (componentes compartidos)
├── types/      (tipos TypeScript compartidos entre apps)
└── config/     (tsconfig, ESLint, Tailwind config compartidos)
```

Orquestado con **Turborepo**, una herramienta de build/cache incremental para monorepos JS/TS (evita recompilar paquetes que no cambiaron, cachea builds entre apps).

**Cuándo tendría sentido para éxodotech:** si el proyecto se divide en múltiples aplicaciones que necesiten compartir código — por ejemplo, una app admin separada del portal estudiante/docente, o una futura app mobile, o si el backend se termina escribiendo también en TypeScript (Node) y conviene compartir tipos de dominio entre frontend y backend.

**Por qué no ahora:** éxodotech hoy es una sola aplicación Next.js. La complejidad operativa de un monorepo (orquestación de builds, versionado de paquetes internos, configuración de Turborepo) no se justifica para un solo app — sería sobre-ingeniería. Se deja documentado explícitamente como **pendiente de expansión futura**, a revisar solo si el proyecto efectivamente se divide en múltiples apps.

---

## 3. Brechas técnicas detectadas (mapa de sub-misión 6)

### A. Seguridad y sesión — prioridad más alta (riesgo real, no solo deuda técnica)

1. **Login demo no despacha `login()`.** El slice `auth` (`store/slices/authSlice.ts`) está listo (`token`, `role`, `name`), pero `app/login/page.tsx` navega directo con `router.push()` sin llamar al action creator `login()`. Sin esto, ningún componente puede saber realmente quién está logueado.

2. **No existe `middleware.ts` — cero protección de rutas.** Cualquiera puede navegar directo a `/dashboard/teacher/evaluar/1` sin sesión ni rol válido. Se resuelve con un único `middleware.ts` en la raíz del proyecto que intercepte requests antes de renderizar y redirija si no hay token/rol válido.

3. **`authSlice.logout()` no resetea el cache de `exodoApi`.** Solo limpia `token`/`role`/`name`, pero el cache de RTK Query (cursos, entregas, etc.) queda intacto en memoria — riesgo de que un usuario nuevo vea por un instante datos cacheados de la sesión anterior en la misma pestaña. **Referencia de solución ya validada en el propio código de Kenny:** en `mn-web/src/store/store.js`, un `rootReducer` custom intercepta las acciones `RESET_STORE`/`auth/logout` y fuerza `state = undefined`, haciendo que todos los reducers (incluido el cache de cada api slice) vuelvan a su estado inicial de una sola vez.

**Por qué van juntas:** son tres piezas del mismo problema ("sesión real") — conviene atacarlas como una sola sub-misión de construcción: conectar `login()` primero, agregar `middleware.ts` después (ya con estado de sesión existiendo), reset de cache como parte del mismo trabajo de `logout`.

### B. Compatibilidad con Next.js 15 — bug confirmado corriendo el proyecto, no teórico

4. **`params` como objeto plano en vez de `Promise`.** Next.js 15 introdujo Async Request APIs: `params` en Server Components pasó a ser `Promise<{...}>`, requiriendo `await params`. Confirmado con advertencia real en `npm run dev` en:
   - `app/dashboard/student/materia/[slug]/page.tsx` — Server Component, arreglo directo: tipar `params: Promise<{ slug: string }>` y hacer `const { slug } = await params`.
   - `app/dashboard/teacher/evaluar/[id]/page.tsx` — más complejo porque es **Client Component** (`"use client"`, tiene formulario interactivo). Los Client Components no pueden ser `async function` ni hacer `await` directo sobre `params`. Soluciones a evaluar: (a) mover la lectura de `params` a un Server Component padre que se lo pase ya resuelto como prop al Client Component, o (b) usar el hook `use()` de React sobre la promesa dentro del Client Component.

### C. Modelado de dominio (TypeScript) — mejoras de tipo, no bugs activos

5. **`TeacherSubmission` duplica campos de `Submission`** (`fileUrl`, `text`, `submittedAt`) en `types/index.ts`, en vez de reusarlos vía `interface TeacherSubmission extends Omit<Submission, "assignmentId"> {...}`. Riesgo bajo hoy, crece si el dominio se expande (cualquier campo nuevo en `Submission` hay que recordar replicarlo a mano).

6. **`Course.level`/`Assignment.status` son uniones literales sin función de validación en el borde.** Garantizan tipos dentro del código TypeScript, pero no validan datos que lleguen de un formulario o de un backend real sin garantía de tipo. Falta el patrón `as const` + type guard:
   ```ts
   export const LEVELS = ["Fundamentos", "Intermedio", "Avanzado"] as const;
   export type Level = typeof LEVELS[number];
   export function isValidLevel(value: string): value is Level {
     return (LEVELS as readonly string[]).includes(value);
   }
   ```
   Se vuelve necesario en cuanto exista un borde real de entrada de datos no confiables (el día que conecten el backend Kotlin/Spring Boot).

### D. Sistema de diseño — adopción de convención, no bug visual

7. **Falta el bloque `.dark {...}` en `app/globals.css`.** `tailwind.config.ts` ya tiene `darkMode: ["class"]` y todos los alias semánticos (`border`, `primary`, `destructive`, etc.) apuntan a variables CSS (`hsl(var(--primary))`), pero no existen los valores alternativos para dark mode — infraestructura lista, falta la otra mitad.

8. **`cn()` y `cva` instalados pero sin un solo uso real.** `lib/utils.ts` define `cn()` (clsx + tailwind-merge) y `class-variance-authority` está en `package.json`, pero ningún componente los usa todavía — ej. `components/layout/Sidebar.tsx` arma clases con un template literal manual (`` `sidebar-link ${isActive(...) ? "active" : ""}` ``) en vez de `cn()`. El patrón de variantes de componente (`cva`) documentado como convención en `CLAUDE.md` no tiene ningún ejemplo real implementado.

### E. Backend

9. **Backend real no confirmado.** `submitAssignment`/`gradeSubmission` en `store/api/exodoApi.ts` apuntan a `NEXT_PUBLIC_API_URL`, pero no hay backend confirmado ni rutas mock en `app/api/`. Es la dependencia raíz de varios de los ítems anteriores (validación en el borde del punto 6, tipos de error reales de RTK Query, sesión real del punto A).

### Prioridad recomendada para la próxima misión de construcción

**A (sesión real) → B (bug Next.js 15, es rápido) → E (backend real) → C/D (tipos y diseño, no bloquean nada)** — la sesión real es la base de la que dependen casi todas las demás piezas (saber quién está logueado); el bug de Next.js 15 ya está confirmado y es barato de arreglar; el backend real habilita validar en el borde de forma genuina; tipos y diseño son pulido que no bloquea funcionalidad.

---

## 4. Evaluación general de arquitectura y stack

### 4.1 Arquitectura actual — no hay decisiones estructurales mal planteadas

El patrón `Route (app/) → Componente ("use client" si interactivo) → hook RTK Query → exodoApi` es consistente en todo el proyecto. La separación Server/Client está bien aplicada (Server Components para fetch inicial, Client Components como hojas del árbol de interactividad — ya alineado con la buena práctica 2026 sin cambios necesarios). El único `apiSlice` es correcto para el tamaño actual (contrasta con los 9 api slices de `mn-web`, que responden a una arquitectura real de microservicios que éxodotech todavía no tiene). Las brechas encontradas son de **completitud** (piezas a medio conectar), no de arquitectura equivocada — con la excepción de las decisiones 2.1 y 2.2 de la sección 2, que Kenny elige adelantar por visión de producto, no porque el estado actual esté mal.

### 4.2 Comparación de stack: propuesta original (9.2/10) vs. stack real implementado

| Tecnología original | Nota original | Stack real | Nota (esta evaluación) | Por qué |
|---|---|---|---|---|
| React 18 + TypeScript | 10/10 | React 19 + TypeScript 5 (`strict: true`), vía Next.js 15.1 | 10/10 | Igual o mejor — versión más nueva de React que la evaluada originalmente |
| Vite 5 + React Router DOM 6 | 10/10 + 9/10 | Next.js 15 App Router (reemplaza ambas) | 9/10 | Cambio de paradigma con trade-off real, no upgrade limpio: la guía 2026 recomienda Vite+React Router para paneles/dashboards detrás de login (describe bien los portales student/teacher), y Next.js para páginas públicas/SEO (describe la landing y login). éxodotech usa un solo framework para todo — decisión pragmática válida para equipo de 2 personas (un codebase, un deploy) a costa de algo de overhead de SSR en partes del dashboard que no lo necesitarían estrictamente |
| RTK Query | 8.5/10 | RTK Query (sin cambios) | 8.5/10 | TanStack Query sigue siendo más popular en proyectos nuevos, pero RTK Query sigue siendo perfectamente válido — además Kenny ya lo domina en producción desde `mn-web`, lo cual es una ventaja práctica real más allá del mérito técnico puro de la tecnología |
| React Hook Form + Zod | 9.5/10 | React Hook Form + Zod (sin cambios) | 9.5/10 | Sigue siendo la combinación estándar de producción en 2026 |
| CSS Modules | 8/10 (con nota: "shadcn/ui + Tailwind sería más moderno") | Tailwind + tokens de marca + capa semántica shadcn/ui | 9.5/10 | Upgrade real — la propia nota original ya sugería este cambio. Investigación 2026 confirma que Tailwind es la recomendación por defecto para proyectos nuevos (todo el ecosistema, incluidos generadores de código con IA, asume Tailwind) |

**Puntuación general: 9.3/10** — prácticamente empatado con el 9.2 original. Calidad general equivalente, llegada por un camino distinto (framework unificado con SSR en vez de SPA + build tool separado), con mejora real en la capa de estilos y una decisión de trade-off consciente (un solo framework) en vez de la arquitectura híbrida teóricamente "óptima" pero más costosa de mantener para un equipo chico.

Sources consultadas para esta comparación:
- [Next.js vs Vite + React: Choosing the Right Stack in 2026](https://www.the90scompany.com/blog/nextjs-vs-vite-react-choosing-the-right-stack)
- [Vite vs Next.js 2026: Which to Use for Your React App](https://designrevision.com/blog/vite-vs-nextjs)
- [Tailwind vs CSS Modules (2026): When Each Beats the Other](https://www.13labs.au/compare/tailwind-vs-css-modules)
- [The Ultimate Next.js App Router Architecture | Feature-Sliced Design](https://feature-sliced.design/blog/nextjs-app-router-guide)
- [Next.js App Router Best Practices for Production (2026)](https://www.javascriptdoctor.blog/2026/07/nextjs-app-router-best-practices-for.html)
- [Architecting Large-Scale Next.js Applications](https://dev.to/addwebsolutionpvtltd/architecting-large-scale-nextjs-applications-folder-structure-patterns-best-practices-2dpj)

---

## 5. Aprendizajes técnicos preservados de la misión (conceptos, no solo brechas)

### TypeScript
- **Interfaces** = forma de un objeto, equivalente a `data class`/DTO de Kotlin.
- **Uniones literales** (`"Fundamentos" | "Intermedio" | "Avanzado"`) como alternativa a `enum` para conjuntos cerrados de strings, sin costo en runtime (se borran al compilar).
- **Por qué éxodotech no usa `enum` de TypeScript para esto:** `tsconfig.json` tiene `"isolatedModules": true` (requerido porque Next.js compila con SWC, archivo por archivo, sin mirar el resto del proyecto). `const enum` necesita "inlinear" su valor viendo todo el programa a la vez — incompatible con compilación aislada, por eso está prohibido bajo `isolatedModules`. Un `enum` normal sí compila, pero genera un objeto real en runtime (deja de ser "gratis").
- **Patrón recomendado para "enum con lógica"** (equivalente al `companion object` + `getEnum()`/`desdeDescripcion()` que Kenny ya usa en sus enums de Kotlin en `mn-core-ms`):
  ```ts
  export const LEVELS = ["Fundamentos", "Intermedio", "Avanzado"] as const;
  export type Level = typeof LEVELS[number];
  export function isValidLevel(value: string): value is Level { ... }
  ```
- **`strict: true`** en `tsconfig.json` (en particular `strictNullChecks`) es lo más parecido en TypeScript al null-safety de Kotlin — obliga a manejar `undefined`/`null` explícitamente.
- **Generics hacia RTK Query:** `builder.query<TipoRespuesta, TipoArgumento>` — los hooks autogenerados (`useGetCoursesQuery`, etc.) heredan estos tipos automáticamente, dando autocompletado y chequeo de tipos end-to-end sin tipar nada extra en los componentes.
- **Utility types usados en el proyecto:** `Omit<T, K>` / `Pick<T, K>` (recomendados para `TeacherSubmission`, ver brecha 5), `ReturnType<typeof fn>` (usado en `store.ts` para derivar `AppStore`/`RootState`/`AppDispatch` sin escribir los tipos a mano), `keyof typeof obj` (usado en `login/page.tsx` para derivar el tipo de las keys de `DEMO_ACCOUNTS`).
- **Calibración de nivel de Kenny:** ya domina tipado fuerte por Kotlin, cero experiencia previa en TypeScript. Analogías Kotlin↔TypeScript funcionan bien como puente pedagógico.

### Next.js App Router
- La carpeta `app/` **es** la tabla de rutas — convención sobre configuración, sin archivo central de rutas a sincronizar a mano.
- `page.tsx`/`layout.tsx`/`loading.tsx`/`error.tsx`/`not-found.tsx`/`route.ts` son nombres reservados literales, no estilo — renombrarlos rompe el ruteo silenciosamente.
- Criterio real Server vs. Client Component: no es "página vs. componente", es "¿necesita hooks/eventos de navegador?".
- Route groups (`(public)`) agrupan rutas bajo un layout compartido sin afectar la URL.
- Patrón store-por-request (`makeStore()` + `useRef` en `StoreProvider.tsx`) vs. singleton clásico de SPA — necesario porque el servidor de Next.js atiende múltiples requests concurrentes de distintos usuarios; un store singleton a nivel de módulo (como el de `mn-web/src/store/store.js`) filtraría estado entre usuarios en SSR.

### RTK Query
- Kenny ya domina RTK Query en producción (`mn-web/src/api/coreApi.js`): `tagTypes`, `providesTags`/`invalidatesTags` (incluida la forma funcional condicional al error), `transformResponse`, `skip`, mutaciones con `.unwrap()` + try/catch.
- Lo que TypeScript agrega sobre lo que ya sabe: contratos de tipo end-to-end (generics en `builder.query`) y manejo de errores tipado (`FetchBaseQueryError`) en vez de `error?.data` a ciegas con optional chaining.

### react-hook-form + zod (sub-misión 4 — Kenny no la asimiló del todo, dejar para reforzar con código real)
- `z.infer<typeof schema>` deriva el tipo TypeScript directamente del schema de validación runtime — una sola fuente de verdad en vez de mantener tipo e interfaz por separado.
- `zodResolver` conecta react-hook-form (maneja estado de formulario) con zod (valida) — sin él, react-hook-form no sabe validar nada por sí solo.
- `.refine()` encadenado a un campo = validación custom de ese campo; `.refine()` después de `.object({...})` = validación cruzada entre campos (ver `submissionSchema`, regla "archivo o texto, no ambos vacíos").

### Tailwind + shadcn/ui (sub-misión 5 — Kenny no la asimiló del todo, dejar para reforzar con código real)
- Dos capas de color: tokens de marca (hex fijos, identidad visual) vs. alias semánticos (`primary`, `border`, etc.) que indirectamente apuntan a variables CSS — la indirección existe para soportar dark mode sin tocar componentes.
- Variables CSS guardadas como HSL sin el wrapper (`230 18% 22%`, no `hsl(230, 18%, 22%)`) para que Tailwind pueda inyectar el canal alfa (`bg-primary/50`).
- `cn()` = `clsx` (arma clases condicionales) + `twMerge` (resuelve conflictos entre utilidades Tailwind que compiten por la misma propiedad CSS, ej. `px-2 px-8` → se queda con `px-8`).

---

## 6. ¿Vale la pena aprender Next.js en 2026?

Sí, según investigación de mercado 2026: aparece en 7-11% de las publicaciones de empleo frontend; developers senior con TypeScript + Next.js + deploy en edge suelen superar $180-200K de compensación total. Dato más importante: el lenguaje (TypeScript, +$27K de prima salarial sobre JS plano) pesa más que el framework específico — "los días de ser especialista en un solo framework ya pasaron, un buen developer puede pivotar entre frameworks con relativa facilidad" una vez que entiende los conceptos de fondo de renderizado:

- **SSR (Server-Side Rendering):** el HTML se genera en el servidor en cada request — es lo que usa éxodotech hoy con Next.js App Router.
- **SSG (Static Site Generation):** el HTML se genera una sola vez en build time, se sirve igual para todos hasta el próximo deploy — ideal para páginas que casi no cambian (ej. una landing).
- **ISR (Incremental Static Regeneration):** un híbrido — el HTML se genera estático como en SSG, pero Next.js lo regenera en segundo plano cada cierto tiempo sin necesitar un nuevo deploy completo.

Entender cuándo usar cada uno es lo que se transfiere entre frameworks (Next.js, Nuxt, SvelteKit, Astro todos ofrecen variantes de estos tres conceptos) — no la sintaxis específica de uno solo. Aprender Next.js expande ese conocimiento de fondo, que cualquier meta-framework comparte — coincide con la intuición de Kenny de que esto amplía su base de conocimiento, no solo agrega una herramienta más a su CV.

### ¿Se aprende esto aparte (teoría) o con el uso (práctica)? — investigado a pedido de Kenny

No es uno u otro — es una secuencia de tres pasos, y el orden importa:

1. **Pase conceptual mínimo primero** (qué es SSR/SSG/ISR y cuándo se usa cada uno — ya cubierto arriba en este documento). Sin esto no se sabe ni qué preguntar cuando algo no se comporta como se espera.
2. **Construir con problemas reales** — la intuición de cómo envejecen las decisiones de arquitectura viene de la experiencia, no de memorizar patrones. Se necesita "un problema, una herramienta, un ciclo de feedback, y suficiente terquedad hasta que lo que estaba en la cabeza exista en el navegador" — la teoría sola no da ese ciclo de feedback.
3. **Lo que realmente separa nivel senior de nivel competente:** no es solo saber usar SSR/SSG/ISR, es estudiar **decisiones reales de sistemas reales y cómo envejecieron con el tiempo** (qué se rompió, qué escaló bien, qué hubo que revertir) — no escenarios teóricos de "imaginemos que...".

**Recomendación concreta para éxodotech:** no hace falta un proyecto de práctica aparte — el propio proyecto ya da terreno para el paso 2. La landing pública (`(public)`) es candidata natural a SSG (casi no cambia), el dashboard con datos de sesión es candidato a SSR (lo que ya usa hoy), y si el catálogo de cursos crece, sería candidato a ISR. Probar deliberadamente cada estrategia en una ruta real de éxodotech y comparar el comportamiento resultante (velocidad de carga, cuándo se regenera el contenido, qué pasa en el build) enseña más que leer artículos — con el beneficio extra de que ya se tiene el ejemplo real del propio proyecto para anclarlo.

Sources:
- [What are good ways to learn software architecture and systems design?](https://dev.to/mikkpr/what-are-good-ways-to-learn-software-architecture-and-systems-design-38b9)
- [How I Actually Build Full End To End Projects Using AI](https://dev.to/bradleymatera/how-i-actually-build-full-end-to-end-projects-using-ai-42do)
- [CSR vs SSR vs SSG vs ISR: Best Rendering Method in 2026](https://hashbyt.com/blog/csr-vs-ssr-vs-ssg-vs-isr)

Sources:
- [Frontend Developer Skills in 2026: 1 in 5 Openings Is Entry-Level](https://medium.com/@interviewstack.io.2026/frontend-developer-skills-in-2026-1-in-5-openings-is-entry-level-0efa09c2c17d)
- [Front-End Web Development in 2026: Trends, Skills & Frameworks](https://www.junkiescoder.com/blog/front-end-web-development-in-2026)

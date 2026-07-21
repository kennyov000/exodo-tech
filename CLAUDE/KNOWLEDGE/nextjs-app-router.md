# Next.js App Router — patrones de arquitectura

## La carpeta `app/` es la tabla de rutas

A diferencia de frameworks con un archivo central de rutas (React Router, Spring Boot con anotaciones `@RequestMapping`), en el App Router la estructura de carpetas **es** la tabla de rutas: `app/dashboard/student/entregas/page.tsx` → `/dashboard/student/entregas`. Es "convención sobre configuración" — no hay archivo que sincronizar a mano, pero a cambio ciertos nombres de archivo dejan de ser libres.

## Nombres de archivo reservados

`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts` son literales que Next.js reconoce por su nombre exacto — no es estilo, es requisito:

| Archivo | Efecto |
|---|---|
| `page.tsx` | Hace que la carpeta sea una ruta navegable |
| `layout.tsx` | Envoltorio persistente para esa carpeta y sus subcarpetas |
| `loading.tsx` / `error.tsx` / `not-found.tsx` | Estados especiales (carga, error, 404) |
| `route.ts` | Endpoint de API |

Una carpeta sin `page.tsx` (aunque tenga `layout.tsx`) es puramente organizativa — no es una ruta alcanzable.

## Layouts anidados vía `children`

Cada `layout.tsx` envuelve todo lo que está debajo en el árbol de carpetas, recibiéndolo a través de `children`. Un Client Component (ej. un layout con sidebar interactivo) puede envolver Server Components sin problema: `children` llega ya renderizado desde el servidor, como un slot opaco — el Client Component nunca lo importa, solo lo posiciona.

## Route groups — layout compartido sin afectar la URL

`app/(public)/layout.tsx` da un layout propio (ej. Nav+Footer de una landing) solo a las rutas dentro de esos paréntesis, sin agregar `/public` a la URL y sin que se filtre a rutas fuera del grupo.

## El criterio real Server vs. Client Component

No es "página vs. componente reutilizable" — es **"¿necesita hooks o eventos del navegador?"** (`useState`, `useEffect`, `onClick`, `usePathname`, drag&drop, etc.). Un componente de solo lectura puede ser Server aunque conceptualmente sea "la misma pantalla" que otro componente interactivo que sí necesita ser Client.

## Async Request APIs (Next.js 15) — `params` como `Promise`

Desde Next.js 15, `params` (y `searchParams`) en Server Components son `Promise`, no objetos planos:

```ts
interface Props { params: Promise<{ slug: string }> }
export default async function Page({ params }: Props) {
  const { slug } = await params;
  ...
}
```

En un **Client Component** (`"use client"`) no se puede usar `async function` ni `await` directo — soluciones: (a) mover la lectura de `params` a un Server Component padre que lo pase ya resuelto como prop, o (b) usar el hook `use()` de React sobre la promesa dentro del Client Component. Código escrito para Next.js 14 o anterior que accede a `params.slug` de forma síncrona genera warning (y eventualmente error) al migrar.

## Colocación — la regla más útil de estructura

Todo lo que una ruta necesita debería vivir junto a ella. Cuando un `page.tsx` empieza a mezclar responsabilidades y crece demasiado, se divide en subcomponentes que viven **en la misma carpeta de la ruta** (ej. `evaluar/[id]/GradingForm.tsx`) en vez de moverlos a una carpeta genérica de `components/` o seguir creciendo un solo archivo.

## Store por-request vs. singleton clásico de SPA

En una SPA clásica (Vite + React Router, o cualquier app que corre entera en el navegador), un store de Redux a nivel de módulo (`export const store = configureStore(...)`) es seguro porque el proceso vive en un solo navegador para un solo usuario.

En Next.js con Server Components/SSR, el mismo proceso de servidor atiende múltiples requests de múltiples usuarios concurrentemente. Un store singleton de módulo se compartiría entre requests de distintos usuarios — riesgo real de fuga de estado (ej. token de un usuario visible en el render de otro). La solución es una **fábrica de store** + inicialización perezosa por instancia de componente:

```ts
// store.ts
export const makeStore = () => configureStore({ ... });
```
```tsx
// StoreProvider.tsx — "use client"
const storeRef = useRef<AppStore | null>(null);
if (!storeRef.current) storeRef.current = makeStore();
return <Provider store={storeRef.current}>{children}</Provider>;
```

Cada request de servidor renderiza su propio árbol de componentes desde cero, así que cada uno obtiene su propio store aislado.

## Estrategias de renderizado — SSR, SSG, ISR

- **SSR (Server-Side Rendering):** el HTML se genera en el servidor en cada request. Para contenido totalmente dinámico/personalizado por usuario (dashboards con datos de sesión).
- **SSG (Static Site Generation):** el HTML se genera una sola vez en build time. Para contenido que casi no cambia (landing, documentación, marketing).
- **ISR (Incremental Static Regeneration):** híbrido — el HTML es estático como en SSG, pero Next.js lo regenera en segundo plano cada cierto tiempo sin necesitar un nuevo deploy completo. Para contenido compartido entre usuarios que cambia periódicamente (catálogos, noticias).

La elección se hace por ruta (e incluso por componente) dentro del mismo App Router — una app puede tener una landing estática, un catálogo con ISR y un dashboard con SSR, todo en el mismo deploy. Elegir mal la estrategia significa páginas lentas o datos obsoletos — es de las decisiones de mayor impacto en una arquitectura Next.js.

**Cómo se aprende esto de verdad:** no es solo teoría ni solo "se aprende usándolo" — es una secuencia: (1) entender los conceptos básicos primero, (2) construir con problemas reales para generar el ciclo de feedback real (probar cada estrategia en una ruta real y observar el comportamiento), y (3) lo que distingue nivel senior — estudiar decisiones reales de sistemas reales y cómo envejecieron con el tiempo, no solo escenarios teóricos.

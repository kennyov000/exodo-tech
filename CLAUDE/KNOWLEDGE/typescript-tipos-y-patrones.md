# TypeScript — tipos y patrones reutilizables

Conocimiento acumulado sobre cómo modelar dominio con TypeScript de forma segura y sin sobre-ingeniería. Aplica a cualquier feature nueva, no solo a la que lo originó.

## Interfaces como forma de dato

`interface` describe la forma de un objeto — qué propiedades tiene y de qué tipo es cada una. Es un contrato de forma, no una clase con lógica ni constructor. Para alguien que viene de un lenguaje con tipado fuerte tipo Kotlin, es el equivalente de un `data class`/DTO: describe qué shape debe tener el dato, y el compilador falla si algo no calza (falta una propiedad, sobra una, el tipo no coincide).

```ts
export interface Course {
  slug:     string;
  title:    string;
  level:    "Fundamentos" | "Intermedio" | "Avanzado";
  duration: string;
  modules:  Module[];
}
```

Se erasea por completo al compilar — en runtime no queda ningún rastro de la interfaz, es una herramienta que existe solo mientras se escribe código.

## Uniones literales como alternativa a `enum`

Para un conjunto cerrado de valores string (`"pending" | "submitted" | "graded"`), una unión literal cierra el conjunto de valores válidos en tiempo de compilación sin generar ningún código en runtime — el valor sigue siendo el string plano.

**Por qué preferir uniones literales sobre `enum` en proyectos con `isolatedModules: true`** (cualquier proyecto Next.js con SWC, o Vite/esbuild): `const enum` necesita "inlinear" su valor viendo todo el programa a la vez (reemplaza cada referencia por su valor literal en tiempo de compilación), lo cual requiere conocimiento cross-file. Compiladores que transpilan archivo por archivo de forma aislada (SWC, esbuild, Babel) no pueden resolver eso — por eso `isolatedModules: true` prohíbe directamente `const enum`, sin importar en qué archivo se declare. Un `enum` normal (sin `const`) sí compila, pero genera un objeto real en el JS final — deja de tener costo cero en runtime.

## Patrón `as const` — el reemplazo idiomático de enum

```ts
export const LEVELS = ["Fundamentos", "Intermedio", "Avanzado"] as const;
export type Level = typeof LEVELS[number]; // "Fundamentos" | "Intermedio" | "Avanzado"
```

- `LEVELS` es un array real de JavaScript, existe en runtime.
- `as const` le pide al compilador que congele cada elemento como su literal exacto en vez de generalizar a `string[]`.
- `typeof LEVELS[number]` deriva automáticamente la unión de todos los tipos posibles al indexar el array — no se escribe dos veces.

## Type guards para validar en el borde del sistema

Las uniones literales garantizan tipos dentro del código TypeScript, pero no validan datos que lleguen de un formulario o de un backend real sin garantía de tipo. Para eso, un type guard:

```ts
export function isValidLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}
```

`value is Level` es la sintaxis de un **type guard** — le dice a TypeScript "si esta función devuelve `true`, dentro del `if` ese valor ya es del tipo `Level`, no solo `string`". Es el punto exacto donde conviene validar cuando el dato viene de un borde no confiable (un formulario, una API externa).

## `strict: true` como null-safety

`strict: true` en `tsconfig.json` activa un grupo de chequeos, el más importante siendo `strictNullChecks`. Sin él, cualquier valor puede ser `null`/`undefined` sin que el compilador avise — el comportamiento por defecto de TypeScript es más parecido a Java pre-`Optional`. Con `strict: true`, es el equivalente más cercano al null-safety de Kotlin: una propiedad opcional debe marcarse explícitamente con `?` (`fileUrl?: string`), y el compilador obliga a verificar que no sea `undefined` antes de usarla como si fuera segura.

## Utility types — transformaciones de tipos que da el compilador

Exclusivos del tipado estructural de TypeScript (sin equivalente directo en lenguajes nominales como Kotlin/Java):

- **`Omit<T, K>`** — toma la forma de `T` y le quita la(s) propiedad(es) `K`. Útil quando un tipo B es "case A menos un campo, más otros":
  ```ts
  interface TeacherSubmission extends Omit<Submission, "assignmentId"> {
    studentName: string;
    grade?: number;
  }
  ```
- **`Pick<T, K>`** — lo inverso: se queda solo con las propiedades indicadas.
- **`Partial<T>`** — vuelve todas las propiedades opcionales (útil para un formulario de edición parcial, o un payload de PATCH).
- **`ReturnType<typeof fn>`** — extrae el tipo de lo que devuelve una función, sin escribirlo a mano. Patrón canónico para derivar el tipo de un store de Redux Toolkit:
  ```ts
  export const makeStore = () => configureStore({ ... });
  export type AppStore  = ReturnType<typeof makeStore>;
  export type RootState = ReturnType<AppStore["getState"]>;
  ```
  Si el store cambia (se agrega un slice), estos tipos se actualizan solos — no hay una interfaz separada que sincronizar a mano.
- **`keyof typeof obj`** — da la unión de los nombres de propiedad de un objeto, derivada de sus keys reales:
  ```ts
  const DEMO_ACCOUNTS = { student: {...}, teacher: {...} } as const;
  type Role = keyof typeof DEMO_ACCOUNTS; // "student" | "teacher"
  ```

## Generics aplicados a RTK Query

`builder.query<TipoDeRespuesta, TipoDeArgumento>` — mismo concepto que un genérico de Kotlin (`List<T>`, `fun <T> algo(): T`). El hook autogenerado (`useGetCoursesQuery`, etc.) hereda estos tipos automáticamente: el `data` que devuelve ya viene tipado, y el argumento que exige el hook al llamarlo también — sin tipar nada extra en el componente que lo consume.

## `import type` — imports que se borran al compilar

```ts
import type { Course, Student } from "@/types";
```

El modificador `type` en el import le dice al compilador que ese import es solo para chequeo de tipos — se borra por completo al compilar a JS, no trae código real. Refuerza el principio de que los tipos no cuestan nada en runtime.

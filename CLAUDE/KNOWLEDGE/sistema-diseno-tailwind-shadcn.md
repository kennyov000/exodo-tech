# Sistema de diseño — Tailwind + tokens + patrón shadcn/ui

## Dos capas de color con propósitos distintos

**Tokens de marca** (valores hex fijos, ej. `sky: "#4A7C9D"`) — la identidad visual de un proyecto, no cambian nunca.

**Alias semánticos** (`border`, `primary`, `destructive`, `muted`, etc.) — una capa de indirección: en vez de hardcodear un color, los componentes usan un nombre semántico que se resuelve leyendo una variable CSS:
```ts
// tailwind.config.ts
primary: { DEFAULT: "hsl(var(--primary))" }
```
```css
/* globals.css */
:root { --primary: 230 18% 22%; }
```

**Por qué la indirección importa:** con `darkMode: ["class"]` configurado, un bloque `.dark { --primary: ...; }` con valores distintos re-skinea toda la app instantáneamente sin tocar un solo componente — porque los componentes nunca hardcodearon el color, hardcodearon el *nombre semántico*.

## Por qué las variables CSS son `230 18% 22%` y no `hsl(230, 18%, 22%)`

Tailwind necesita inyectar el canal alfa para que funcionen modificadores de opacidad (`bg-primary/50`) — arma `hsl(var(--primary) / 50%)` en tiempo de compilación. Eso solo es posible si la variable guarda los tres números HSL separados por espacios, sin el wrapper `hsl(...)`. Guardar la variable como hex o como `hsl(...)` completo rompe la sintaxis de opacidad.

## `cn()` — por qué `clsx` solo no alcanza

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- **`clsx`** arma un string de clases condicionales (strings, objetos `{ "active": cond }`, arrays, ignora valores falsy).
- **`twMerge`** resuelve conflictos entre utilidades de Tailwind que compiten por la misma propiedad CSS — sin esto, `cn("px-2", "px-8")` dejaría ambas clases en el DOM con resultado impredecible según el orden del CSS generado; `twMerge` se queda solo con la última (`px-8`), de forma determinística. Es lo que hace confiable el patrón "componente con estilos por defecto, sobreescribibles por quien lo usa" (`<Button className="px-8" />` sobre un botón que ya trae `px-2` por defecto).

## `cva` (class-variance-authority) — variantes de componente declarativas

```ts
const buttonVariants = cva(
  "inline-flex items-center rounded-md font-medium transition-colors",
  {
    variants: {
      intent: { primary: "bg-primary text-primary-foreground", destructive: "bg-destructive text-destructive-foreground" },
      size:   { sm: "px-3 py-1.5 text-sm", lg: "px-6 py-3 text-base" },
    },
    defaultVariants: { intent: "primary", size: "sm" },
  }
);
// buttonVariants({ intent: "destructive", size: "lg" }) → string de clases resuelto
```

Declara de forma centralizada qué combinaciones de variantes existen para un componente, con autocompletado de TypeScript sobre los valores válidos (uniones literales por debajo). Evita copiar/pegar clases cada vez que se necesita una variante ya definida en otro lugar.

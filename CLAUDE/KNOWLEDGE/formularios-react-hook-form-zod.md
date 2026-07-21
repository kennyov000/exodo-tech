# Formularios — react-hook-form + zod

## Por qué existe zod — el hueco que TypeScript no tapa solo

TypeScript se borra por completo en runtime — un `interface` no protege contra datos reales que lleguen mal formados (input de usuario, JSON de una API). zod valida datos **en runtime** (rol equivalente a Bean Validation/`@Valid` en Spring Boot: `@NotNull`, `@Email`, `@Size`), con un plus: el schema también deriva el tipo estático de TypeScript, evitando mantener tipo y reglas de validación por separado.

```ts
const loginSchema = z.object({
  email:    z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginValues = z.infer<typeof loginSchema>;
```

`z.infer<typeof schema>` extrae el tipo TypeScript directamente del schema — una sola fuente de verdad.

## `zodResolver` — el pegamento entre react-hook-form y zod

react-hook-form maneja estado de formulario pero no sabe validar por sí solo. `zodResolver(schema)` adapta el schema de zod a la función de validación que react-hook-form espera:

```ts
useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
```

Al hacer submit, corre el equivalente de `schema.safeParse(valores)` y llena `errors.<campo>.message` automáticamente con los mensajes definidos en el schema.

## `.refine()` por campo vs. `.refine()` cruzado

**Por campo** (encadenado a un campo específico): validación custom más allá del tipo básico.
```ts
file: z.instanceof(File)
  .refine((f) => f.size <= MAX_SIZE, "Máximo 5 MB.")
  .refine((f) => TIPOS_ACEPTADOS.includes(f.type), "Tipo no soportado."),
```

**Cruzado** (encadenado después de `.object({...})`): reglas de negocio que dependen de más de un campo a la vez, imposibles de expresar validando un solo campo:
```ts
z.object({ text: z.string().optional(), file: z.instanceof(File).optional() })
  .refine((data) => data.text?.trim() || data.file, {
    message: "Debes adjuntar un archivo o escribir tu respuesta.",
    path: ["text"], // bajo qué campo se muestra el error
  });
```

**Límite a tener presente:** el tipo inferido (`z.infer`) de un schema con `.refine()` cruzado no refleja esa restricción a nivel de tipo — ambos campos quedan opcionales en `LoginValues`/`SubmissionFormValues` aunque la regla de "al menos uno" se aplique en runtime. zod da runtime-safety, no siempre un tipo estático más estricto.

## `setValue` para inputs que no pasan por `register` normal

Cuando un campo se llena por una interacción custom (drag&drop, selección programática) en vez de un `<input onChange>` estándar:
```ts
setValue("file", file, { shouldValidate: true });
```
Inyecta el valor en el estado interno de react-hook-form como si el usuario lo hubiera escrito, y `{ shouldValidate: true }` fuerza que corra la validación de zod sobre ese campo de inmediato.

# Redux Toolkit + RTK Query — patrones de arquitectura

## Un solo `apiSlice` vs. varios

Un proyecto con un solo backend/dominio (o sin backend confirmado todavía) no necesita más de un `createApi` — un único `apiSlice` con varios endpoints es suficiente y más simple de mantener. Fragmentar en varios `apiSlice` (uno por dominio o microservicio) se justifica cuando el backend real ya está dividido en servicios independientes — en ese caso, un `apiSlice` por servicio (cada uno con su propio `reducerPath`, `baseUrl` y `tagTypes`) refleja esa separación real y evita que un solo archivo de API crezca sin límite.

## `tagTypes` + `providesTags`/`invalidatesTags`

El mecanismo de invalidación de cache de RTK Query: una query "provee" un tag, una mutación "invalida" ese tag, y RTK Query refetchea automáticamente cualquier query activa que provea ese tag.

```ts
getCourses: builder.query<Course[], void>({
  query: () => "/courses",
  providesTags: ["Course"],
}),
submitAssignment: builder.mutation<{ id: string }, {...}>({
  query: (...) => ({...}),
  invalidatesTags: ["Submission"],
}),
```

Patrón más fino: forma funcional de `invalidatesTags` que evita invalidar en caso de error:
```ts
invalidatesTags: (result, error) => (error ? [] : ["Submission"]),
```

## Capa de hooks custom — `componente → hook → servicio/RTK Query → API`

Buena práctica de dirección de dependencias: los componentes no deberían llamar directo a los hooks generados por `createApi` cuando hay lógica de negocio o estado derivado involucrado. En vez de eso, un hook custom por feature envuelve las queries/mutations + estado local:

```js
// patrón: hook custom que envuelve RTK Query + estado + manejo de error
function useAlgunaFeature() {
  const { data } = useGetAlgoQuery();
  const [updateAlgo] = useUpdateAlgoMutation();

  const actualizar = async (payload) => {
    try {
      await updateAlgo(payload).unwrap();
      // éxito
    } catch (e) {
      // manejo de error
    }
  };

  return { data, actualizar };
}
```

`.unwrap()` en un mutation hook hace que la promesa rechace de verdad en caso de error (por defecto, RTK Query no rechaza la promesa, resuelve con un objeto `{ error }`) — necesario para poder usar `try/catch` de forma natural. Este patrón concentra la lógica de negocio en el hook, dejando el componente solo con responsabilidad de orquestar UI (diálogos, formularios, feedback visual).

**Cuándo vale la pena esta capa incluso en un proyecto chico:** si se adopta desde el inicio, evita una migración forzada bajo presión cuando el proyecto crece y los componentes empiezan a acumular lógica de negocio mezclada con JSX.

## Manejo de error tipado — `FetchBaseQueryError`

Con TypeScript, RTK Query expone un tipo de error real (`FetchBaseQueryError`), una unión discriminada (por ejemplo `{ status: number, data: unknown }` para errores HTTP, o `{ status: "FETCH_ERROR", error: string }` para errores de red). El compilador obliga a manejar cada caso, en vez de encadenar `error?.data`/`error?.response?.data` con optional chaining "a ciegas", adivinando la forma del objeto de error.

## Reset completo del store al hacer logout

Un `logout()` que solo limpia el slice de auth (`token`, `role`, `name`) deja el cache de RTK Query (datos de la sesión anterior) intacto en memoria — riesgo de que un usuario nuevo vea por un instante datos cacheados del usuario anterior en la misma pestaña.

Patrón de solución: un `rootReducer` custom que intercepta la acción de logout y fuerza el estado completo a `undefined`, haciendo que todos los reducers (incluido el cache de cada api slice) vuelvan a su estado inicial de una sola vez:

```js
const appReducer = combineReducers({ ...todosLosReducers });

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({ reducer: rootReducer, ... });
```

Es la forma correcta de garantizar que ningún dato de la sesión anterior sobreviva a un cambio de usuario en la misma pestaña.

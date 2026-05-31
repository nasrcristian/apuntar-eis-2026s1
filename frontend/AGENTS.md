# AGENTS.md — Frontend Apuntar

Guía para Copilot y agentes de IA sobre cómo está estructurado este proyecto y cómo extenderlo correctamente.

---

## Stack

- **React 18** + **TypeScript**
- **Vite** como bundler
- **MUI v6** (Material UI) para componentes de UI
- **React Router v6** para navegación
- **Axios** para llamadas HTTP (con interceptor de JWT en `axiosConfig.ts`)
- **Notistack** para snackbars/notificaciones

---

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/            # ProtectedRoute y afines
│   ├── navbar/          # Navbar y NavigationButton
│   ├── MaterialCard.tsx # Tarjeta de material (lista)
│   ├── UserCard.tsx     # Tarjeta de perfil de usuario
│   └── ...
├── context/
│   └── AuthContext.tsx  # Estado global de autenticación (token, login, logout)
├── hooks/               # Custom hooks — lógica desacoplada de la UI
│   ├── useUser.ts
│   ├── useMaterials.ts
│   ├── useMaterialDetail.ts
│   ├── useUploadMaterial.ts
│   └── useEditMaterial.ts
├── pages/               # Una página por ruta
│   ├── auth/
│   ├── Register/
│   ├── MaterialPage/
│   └── ...
├── service/
│   ├── api.ts           # Todas las funciones de llamada al backend
│   └── auth.ts          # Helpers de JWT (getCurrentUserEmail)
├── types/
│   ├── material.ts      # Tipos relacionados a materiales y reacciones
│   └── dto.ts           # DTOs de request/response generales
├── constants/
│   └── materialOptions.ts
└── utils/
    └── axiosConfig.ts   # Interceptor global de Authorization header
```

---

## Convenciones y buenas prácticas

### Separación de responsabilidades

**La lógica NO va en los componentes de página ni en los componentes de UI.**
Cada feature sigue este patrón:

```
Page/Component  →  Hook  →  service/api.ts  →  Backend
```

- **Pages**: solo orquestan. Llaman hooks, pasan props, renderizan layout.
- **Components**: solo presentación y eventos locales. Sin fetch, sin lógica de negocio.
- **Hooks** (`use*.ts`): toda la lógica async, estado derivado, efectos secundarios.
- **`service/api.ts`**: única fuente de verdad para URLs y llamadas HTTP. Una función por endpoint.

#### Ejemplo correcto

```ts
// hooks/useFavorites.ts
export function useFavorites(materialId: number) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getFavoriteStatus(materialId).then(res => setIsFavorite(res.data.isFavorite))
  }, [materialId])

  const toggle = async () => {
    setLoading(true)
    const res = await toggleFavorite(materialId)
    setIsFavorite(res.data.isFavorite)
    setLoading(false)
  }

  return { isFavorite, loading, toggle }
}

// components/FavoriteButton.tsx
export function FavoriteButton({ materialId }: { materialId: number }) {
  const { isFavorite, loading, toggle } = useFavorites(materialId)
  return (
    <IconButton onClick={toggle} disabled={loading} color={isFavorite ? 'error' : 'default'}>
      {isFavorite ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  )
}
```

#### Ejemplo incorrecto — no hacer esto

```ts
// ❌ Fetch dentro de un componente de página
export default function ProfilePage() {
  useEffect(() => {
    fetch('/user/me').then(...) // ← esto va en un hook
  }, [])
}
```

---

### Autenticación

- El token JWT se guarda en `localStorage` bajo la clave `"jwt"`.
- El contexto `AuthContext` expone `isLoggedIn`, `token`, `login(token, user)` y `logout()`.
- `login()` guarda el token en localStorage y actualiza el estado React.
- El interceptor en `axiosConfig.ts` agrega el header `Authorization: Bearer <token>` a todos los requests de Axios automáticamente.
- Para leer el email del usuario logueado sin llamar al backend, usá `getCurrentUserEmail()` de `service/auth.ts` — lee y decodifica el JWT. Esto es solo para UI condicional, **nunca para seguridad**.
- Las rutas protegidas se envuelven en `<ProtectedRoute>` dentro de `App.tsx`.

```tsx
// App.tsx
<Route path="/mi-ruta" element={
  <ProtectedRoute><MiPagina /></ProtectedRoute>
} />
```

---

### Llamadas al backend

Todas las llamadas HTTP van en `service/api.ts`. Usar las funciones `get`, `post`, `del` internas que ya manejan errores uniformemente.

```ts
// ✅ Correcto: función nueva en api.ts
export const getMyFavorites = (): Promise<ResolvedResponse<MaterialDTO[]>> => {
  const token = localStorage.getItem('jwt')
  return get<MaterialDTO[]>(`${urlApi}/materiales/favoritos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
```

**Nota sobre el token**: Axios tiene un interceptor global que agrega el token. Sin embargo, para endpoints protegidos donde el token puede haberse seteado después del init del módulo, se recomienda leer `localStorage.getItem('jwt')` en el momento de la llamada (como hace `getMyMaterials`).

El backend corre en `http://localhost:8080`.

---

### MUI v6 — Cambios importantes

Este proyecto usa **MUI v6**. Hay breaking changes respecto a v5:

- `<Grid item xs={...}>` ya **no existe**. Usar `<Grid size={...}>` o `<Grid size="grow">`.
- `<Grid container>` no acepta props de flexbox directamente (como `alignItems`). Usarlas dentro de `sx`:

```tsx
// ✅ MUI v6
<Grid container spacing={2} sx={{ alignItems: 'center' }}>
  <Grid size="grow">...</Grid>
  <Grid size={4}>...</Grid>
</Grid>

// ❌ MUI v5 — no funciona en v6
<Grid container spacing={2} alignItems="center">
  <Grid item xs>...</Grid>
</Grid>
```

---

### Páginas de listado de materiales

`MaterialListPage` es un componente genérico que acepta una `fetchFn` para reutilizarse en distintos contextos (biblioteca, mis publicaciones, favoritos):

```tsx
<MaterialListPage
  title="Mis favoritos"
  fetchFn={getMyFavorites}
  emptyMessage="Aún no marcaste ningún favorito."
  emptyAction={{ label: 'Explorar', onClick: () => navigate('/library') }}
/>
```

---

### Notificaciones

Usar `enqueueSnackbar` de `notistack` para feedback al usuario tras acciones:

```ts
import { enqueueSnackbar } from 'notistack'

enqueueSnackbar('Material eliminado', { variant: 'success' })
enqueueSnackbar('Error al guardar', { variant: 'error' })
```

---

### Tipos

- Los tipos de materiales (DTOs de respuesta) van en `src/types/material.ts`.
- Los DTOs de request/response generales van en `src/types/dto.ts`.
- Los tipos locales a un hook pueden vivir en el mismo archivo del hook.

---

## Agregar una nueva feature — checklist

1. **Endpoint nuevo** → agregar función en `service/api.ts`
2. **Lógica de estado/async** → crear o extender un hook en `hooks/`
3. **UI** → crear componente en `components/` (si es reutilizable) o directamente en la page
4. **Ruta nueva** → agregar en `App.tsx`, envolver en `<ProtectedRoute>` si requiere login
5. **Ruta protegida** → agregar el path a `PROTECTED_ROUTES` en `Navbar.tsx` si el logout debe redirigir desde ahí

---

## Lo que NO hacer

- No hacer fetch directamente en componentes ni en pages — siempre a través de un hook.
- No usar `any` salvo en casos excepcionales ya existentes (legacy).
- No duplicar la URL base del backend — está definida como `urlApi` en `api.ts`.
- No usar props de flexbox directamente en `<Grid container>` (MUI v6).
- No usar `getCurrentUserEmail()` para decisiones de seguridad, solo para UI condicional.

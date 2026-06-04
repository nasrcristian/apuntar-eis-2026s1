# Plan de implementación — Ver el perfil de otros usuarios

## Historia de usuario

> Como usuario quiero ver el perfil de otros usuarios para poder conocer los materiales que son de su autoría.

### Criterios de aceptación

- Se debe poder acceder al perfil de otros usuarios al clickear tanto su **nombre** como su **ícono** en el detalle de un material, así como en un **comentario** publicado por el mismo.
- Al acceder al perfil se muestra, en una sección, únicamente el componente con la información del perfil (igual que en "Mi Perfil").
- Debajo, el listado de materiales subidos por el usuario, reutilizando el componente de tarjeta ya existente.
- Al clickear cualquier material se redirige al detalle del material (igual que en la biblioteca).
- Si el usuario clickeado es el mismo que está logueado, se redirige a la pestaña **"Mi Perfil"**.
- Un usuario **no logueado** puede ver los materiales de los perfiles, pero no puede valorar ni comentar (se mantiene el comportamiento actual del detalle: aviso + acción deshabilitada).

**Nota del enunciado:** la conexión entre un material y un usuario es el `ownerMail` del material.

---

## Enfoque y decisiones confirmadas

Feature **full-stack**: el backend hoy **no** expone forma de leer el perfil ni los materiales de _otro_ usuario.

| Dato necesario | Endpoint hoy | Por qué no sirve |
|----------------|--------------|------------------|
| Perfil de otro usuario | `GET /user/me` | Devuelve solo al usuario logueado (`authentication.name`); además `/user/**` es `authenticated()`. |
| Materiales de otro usuario | `GET /materiales/mis-publicaciones` | Filtra por el token del logueado, no por un `ownerMail` arbitrario. |

Por eso se agregan **2 endpoints públicos** (deben ser accesibles sin sesión, según el criterio de "no logueado"):

1. `GET /user/perfil?mail=<email>` → `UserDto` público (`name`, `surname`, `mail`).
2. `GET /materiales/usuario?mail=<email>` → `List<MaterialDTO>` (reusa `MaterialService.findByOwnerMail`, que **ya existe**).

> **Por qué query param y no path** (`/user/{mail}`): el email lleva `@` y `.`; los `PathVariable` de Spring se cortan en el último `.` y obligan a encoding frágil. El query param lo evita. Además `/user/{mail}` colisionaría con `/user/me` en el matcher de seguridad.

Decisiones de la HU:
- **Listado**: se reutiliza `MaterialCard` directamente (sin `MaterialListPage`, para no arrastrar buscador/filtro de categoría dentro del perfil).
- **No logueado**: se mantiene el comportamiento actual del detalle (snackbar "Debes iniciar sesión…" + input deshabilitado). No se toca el detalle de material.
- **Auto-redirección**: la lógica "si soy yo → Mi Perfil" vive **una sola vez** en la página de perfil, así cualquier punto de entrada (nombre, ícono, comentario propio) la respeta sin duplicar.

Se respeta `AGENTS.md`: la lógica async va en **hooks**, las URLs en **`service/api.ts`**, las pages solo orquestan y los componentes solo presentan.

---

## Backend

### Modificados

**1. `controller/UserController.kt`** — nuevo endpoint público de perfil:

```kotlin
@GetMapping("/perfil")
fun getUserProfile(@RequestParam mail: String): ResponseEntity<UserDto> {
    val user = service.getUserByEmail(mail) ?: return ResponseEntity.notFound().build()
    return ResponseEntity.ok(user.toDto())
}
```
> Reusa `service.getUserByEmail` y `User.toDto()` ya existentes. `UserDto` ya expone solo datos públicos (`name`, `surname`, `mail`) — no hay password ni datos sensibles.

**2. `controller/MaterialController.kt`** — materiales por dueño (mismo patrón que `mis-publicaciones`):

```kotlin
@GetMapping("/usuario")
fun getByOwner(@RequestParam mail: String): ResponseEntity<List<MaterialDTO>> =
    ResponseEntity.ok(
        materialService.findByOwnerMail(mail)
            .sortedByDescending { it.createdAt }
            .map { it.toDTO() }
    )
```
> `findByOwnerMail` ya está en `MaterialService`/`MaterialServiceImpl`: no hay lógica nueva de negocio. El path literal `/usuario` no colisiona con `@GetMapping("/{id}")` (Spring prioriza el literal, igual que con `/filtrado` y `/favoritos`).

**3. `config/SecurityConfig.kt`** — hacer públicos los dos GET. El orden importa (primer match gana), así que el de `/user/perfil` debe ir **antes** de `auth.requestMatchers("/user/**").authenticated()` (línea 68):

```kotlin
auth.requestMatchers(HttpMethod.GET, "/user/perfil").permitAll()
auth.requestMatchers(HttpMethod.GET, "/materiales/usuario").permitAll()
```
> `/materiales/usuario` GET ya cae hoy bajo `/materiales/{id}` `permitAll`, pero se agrega explícito por claridad. `/user/perfil` **sí** es imprescindible: sin esto lo atrapa `/user/**` → 401.

### Tests sugeridos (extender los de integración existentes)

- `UserControllerIntegrationTest`: `GET /user/perfil?mail=` sin token → 200; mail inexistente → 404.
- `MaterialServiceIntegrationTest` / controller: `GET /materiales/usuario?mail=` → solo materiales de ese owner, ordenados por fecha desc; sin token → 200.

---

## Frontend

### Archivos nuevos

1. **`src/hooks/useUserProfile.ts`** — toda la lógica async del perfil ajeno:
   - Recibe `mail`, hace en paralelo `getUserProfile(mail)` y `getMaterialsByOwner(mail)`.
   - Devuelve `{ user, materials, loading, error }`.
   - Usa `AbortController` y maneja el 404 de perfil como `error`.

2. **`src/pages/UserProfilePage.tsx`** — la página de la ruta `/usuario/:mail`:
   - Lee y decodifica el `mail` del param.
   - **Auto-redirección** a `/profile` si `getCurrentUserEmail() === mail` (con `replace: true`).
   - Renderiza header + `<UserCard user={user} />` (reuso) y, debajo, la lista de `<MaterialCard>`.
   - Estados de `loading` (spinner), `error` (Alert) y vacío ("Este usuario aún no publicó materiales").

### Archivos modificados

3. **`src/service/api.ts`** — dos funciones nuevas (una por endpoint):

```ts
export const getUserProfile = (mail: string): Promise<ResolvedResponse<UserDto>> =>
  get<UserDto>(`${urlApi}/user/perfil?mail=${encodeURIComponent(mail)}`);

export const getMaterialsByOwner = (mail: string): Promise<ResolvedResponse<MaterialDTO[]>> =>
  get<MaterialDTO[]>(`${urlApi}/materiales/usuario?mail=${encodeURIComponent(mail)}`);
```
> Son públicas: no necesitan header de auth (el interceptor lo agrega si hay token, sin molestar).

4. **`src/App.tsx`** — ruta nueva, **sin** `ProtectedRoute` (se ve sin sesión):

```tsx
<Route path="/usuario/:mail" element={<UserProfilePage />} />
```

5. **`src/components/MaterialSidebar/MaterialSidebar.tsx`** — el campo "Autor" (`material.ownerMail`) pasa a ser clickeable:
   - Importar `useNavigate`.
   - Dar a `Field` un prop opcional `onClick` (cursor pointer + hover) y pasarlo solo en el de Autor:
     `onClick={() => navigate(\`/usuario/${encodeURIComponent(material.ownerMail)}\`)}`.
   - Cubre el criterio "nombre y/o ícono" en el detalle (ícono `PersonIcon` + valor dentro del mismo `Field`).

6. **`src/components/MaterialDetail/MaterialDetail.tsx`** — autor de cada comentario clickeable:
   - El `Box` que envuelve `Avatar` + `authorName` (`material-detail__comment-author`) se vuelve clickeable → `navigate(\`/usuario/${encodeURIComponent(comment.userId)}\`)`.
   - `comment.userId` es el email del autor (ya se usa así en `handleDelete`: `comment.userId === currentUser.mail`).
   - Agregar `cursor: pointer` (en `.material-detail__comment-author` del `.css`).

> **Clickear material → detalle** sale gratis: `MaterialCard` ya navega a `/material/${id}` en su `onClick`. Como `MaterialCard` oculta editar/eliminar cuando `isOwner` es falso, en el perfil ajeno solo se ve favorito (si hay sesión). El prop requerido `onDelete` se pasa como no-op.

---

## Pasos ordenados

### 1. Backend
1. Agregar `getUserProfile` en `UserController`.
2. Agregar `getByOwner` en `MaterialController`.
3. Agregar los dos `permitAll` en `SecurityConfig` (respetando el orden antes de `/user/**`).
4. Verificar con curl sin token:
   - `curl "http://localhost:8080/user/perfil?mail=algun@mail.com"` → 200 con `{name,surname,mail}`.
   - `curl "http://localhost:8080/materiales/usuario?mail=algun@mail.com"` → 200 con array.

### 2. Service (frontend)
5. Agregar `getUserProfile` y `getMaterialsByOwner` en `service/api.ts`.

### 3. Hook
6. Crear `hooks/useUserProfile.ts` (fetch en paralelo + estados).

### 4. Página y ruta
7. Crear `pages/UserProfilePage.tsx` (auto-redirección, `UserCard`, lista de `MaterialCard`).
8. Registrar la ruta `/usuario/:mail` en `App.tsx` (sin `ProtectedRoute`).

### 5. Puntos de entrada (clicks)
9. Hacer clickeable el autor en `MaterialSidebar` (campo "Autor").
10. Hacer clickeable el autor/avatar de cada comentario en `MaterialDetail`.

### 6. Pruebas manuales
11. Logueado → clic en autor de un material ajeno → ve perfil + materiales; clic en material → detalle.
12. Clic en **tu propio** nombre/ícono (en un material o comentario tuyo) → redirige a `/profile`.
13. Deslogueado → puede entrar a `/usuario/<mail>` y ver todo; en el detalle no puede valorar/comentar (comportamiento actual).
14. Mail inexistente → la página muestra estado de error amigable.

---

## Riesgos y bordes

- **Email en la URL**: siempre `encodeURIComponent` al navegar y `decodeURIComponent` al leer el param. El `:` de React Router toma el segmento completo; `@`/`.` no rompen el ruteo client-side.
- **Usuario sin nombre/apellido**: `UserCard` ya cae a "Sin nombre" / inicial `?`.
- **Orden de matchers de seguridad**: el `permitAll` de `/user/perfil` debe ir antes que `/user/**` authenticated, o sigue dando 401.
- **No romper `/user/me`**: se usa `/user/perfil` (path distinto) justamente para no afectar el endpoint del usuario propio.
- **Reuso real**: no se duplica la auto-redirección "soy yo → Mi Perfil"; vive solo en `UserProfilePage`, de modo que todos los puntos de entrada la heredan.

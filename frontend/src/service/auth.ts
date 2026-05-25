/**
 * Devuelve el email del usuario logueado, leyendo el JWT del localStorage.
 * Útil SOLO para condicionar UI (ej. ocultar botones de acciones que no son tuyas).
 * NO usar para decisiones de seguridad — la seguridad real está en el backend.
 */
export const getCurrentUserEmail = (): string | null => {
    const token = localStorage.getItem('jwt')
    if (!token) return null

    try {
        // Un JWT es 'header.payload.signature'. El payload es base64.
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.sub ?? null    // 'sub' es el subject del JWT (el email)
    } catch {
        return null
    }
}
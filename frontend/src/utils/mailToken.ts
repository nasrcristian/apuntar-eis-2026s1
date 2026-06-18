/**
 * Ofusca el email para no mostrarlo en texto plano en la URL.
 *
 * OJO: es base64url, REVERSIBLE — no es seguridad real, solo evita que el
 * email se lea a simple vista / quede indexable. Para privacidad real haría
 * falta un id opaco resuelto en el backend.
 */
export const encodeMail = (mail: string): string =>
  btoa(mail).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const decodeMail = (token: string): string | null => {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/')
    return atob(base64)
  } catch {
    return null
  }
}

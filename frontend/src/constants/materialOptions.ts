export const materias = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'fisica', label: 'Física' },
  { value: 'quimica', label: 'Química' },
  { value: 'programacion', label: 'Programación' },
  { value: 'economia', label: 'Economía' },
]

export const carreras = [
  { value: 'ingenieria', label: 'Ingeniería' },
  { value: 'ciencias', label: 'Ciencias' },
  { value: 'economicas', label: 'Económicas' },
  { value: 'humanidades', label: 'Humanidades' },
]

export const categorias = [
  { value: 'apunte', label: 'Apunte' },
  { value: 'resumen', label: 'Resumen' },
  { value: 'modelo_examen', label: 'Modelo de examen' },
  { value: 'presentacion', label: 'Presentación' },
  { value: 'trabajo_practico', label: 'Trabajo práctico' },
  { value: 'cuadro_grafico', label: 'Cuadro o gráfico' },
  { value: 'otro', label: 'Otro' },
]

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ALLOWED_EXTENSIONS = '.pdf,.doc,.docx'
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
export const MAX_FILES = 10

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function isValidFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `Tipo no permitido: ${file.name}` }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `${file.name} supera los 20 MB` }
  }
  return { valid: true }
}
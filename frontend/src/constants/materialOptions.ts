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

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 
  'video/x-matroska', 
  'video/quicktime'
]

export const ALLOWED_FILE_TYPES = [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_VIDEO_TYPES]
export const ALLOWED_EXTENSIONS = '.pdf,.doc,.docx,.mp4,.mkv,.mov'

export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024 // 20 MB
export const MAX_VIDEO_SIZE = 350 * 1024 * 1024 // 350 MB
export const MAX_FILES = 10

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function isValidFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `Tipo no permitido: ${file.type}` }
  }

  const maxSize = ALLOWED_VIDEO_TYPES.includes(file.type) ? MAX_VIDEO_SIZE : MAX_DOCUMENT_SIZE
  const maxSizeMB = maxSize / 1024 / 1024

  if (file.size > maxSize) {
    return {valid: false, error: `${file.name} supera los ${maxSizeMB} MB permitidos para ${file.type.includes('video') ? 'videos' : 'documentos'}`}
  }
  return { valid: true }
}
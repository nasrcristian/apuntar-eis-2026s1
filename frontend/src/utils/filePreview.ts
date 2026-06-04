import { GlobalWorkerOptions } from 'pdfjs-dist'
// Import del worker para Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Setup único e idempotente del worker de pdfjs.
// Centralizado acá para no duplicarlo en cada componente que use pdfjs.
GlobalWorkerOptions.workerSrc = pdfWorker

const API_BASE = 'http://localhost:8080'

/** Máximo de páginas a previsualizar (criterio de aceptación). */
export const MAX_PREVIEW_PAGES = 10

const PDF_CONTENT_TYPE = 'application/pdf'
const DOCX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

/** URL pública para descargar/leer los bytes de un archivo de un material. */
export function fileUrl(materialId: number, storedFileName: string): string {
  return `${API_BASE}/materiales/${materialId}/archivos/${storedFileName}`
}

export type PreviewKind = 'pdf' | 'docx' | 'unsupported'

/**
 * Determina cómo previsualizar un archivo según su content-type.
 * `unsupported` incluye `.doc` (application/msword), videos y cualquier otro.
 */
export function getPreviewKind(contentType: string): PreviewKind {
  if (contentType === PDF_CONTENT_TYPE) return 'pdf'
  if (contentType === DOCX_CONTENT_TYPE) return 'docx'
  return 'unsupported'
}

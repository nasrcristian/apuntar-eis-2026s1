import { useEffect, useRef, useState } from 'react'
import { getDocument } from 'pdfjs-dist'
import type { FileMetadataDTO } from '../types/material'
import {
  fileUrl,
  getPreviewKind,
  MAX_PREVIEW_PAGES,
  type PreviewKind,
} from '../utils/filePreview'

export type PreviewStatus = 'loading' | 'ready' | 'unsupported' | 'error'

interface UseDocumentPreviewResult {
  status: PreviewStatus
  kind: PreviewKind
  /** dataURLs de cada página renderizada (solo PDF). */
  pdfPages: string[]
  /** Contenedor donde se inyecta el render de DOCX. */
  docxContainerRef: React.RefObject<HTMLDivElement | null>
}

const PDF_RENDER_SCALE = 1.3

/**
 * Genera la previsualización (PDF o DOCX) de un archivo de material.
 * Toda la lógica async/render vive acá; el componente solo presenta.
 */
export function useDocumentPreview(
  materialId: number,
  file?: FileMetadataDTO
): UseDocumentPreviewResult {
  const kind: PreviewKind = file ? getPreviewKind(file.contentType) : 'unsupported'
  const key = `${materialId}:${file?.storedFileName ?? ''}`

  const [asyncStatus, setAsyncStatus] = useState<PreviewStatus>('loading')
  const [pdfPages, setPdfPages] = useState<string[]>([])
  const [trackedKey, setTrackedKey] = useState(key)
  const docxContainerRef = useRef<HTMLDivElement>(null)

  // Reset al cambiar de archivo (patrón "ajustar estado durante el render"):
  // evita setState sincrónico dentro del efecto.
  if (key !== trackedKey) {
    setTrackedKey(key)
    setAsyncStatus('loading')
    setPdfPages([])
  }

  // 'unsupported' es derivado: no necesita efecto ni estado propio.
  const status: PreviewStatus = kind === 'unsupported' ? 'unsupported' : asyncStatus

  useEffect(() => {
    if (!file || kind === 'unsupported') return

    let cancelled = false
    const ac = new AbortController()
    const url = fileUrl(materialId, file.storedFileName)

    const renderPdf = async () => {
      const pdf = await getDocument({ url }).promise
      const total = Math.min(pdf.numPages, MAX_PREVIEW_PAGES)
      const pages: string[] = []
      for (let p = 1; p <= total; p++) {
        const page = await pdf.getPage(p)
        const viewport = page.getViewport({ scale: PDF_RENDER_SCALE })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) throw new Error('No 2d context')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvas, viewport }).promise
        if (cancelled) return
        pages.push(canvas.toDataURL('image/png'))
      }
      if (!cancelled) {
        setPdfPages(pages)
        setAsyncStatus('ready')
      }
    }

    const renderDocx = async () => {
      const response = await fetch(url, { signal: ac.signal })
      const blob = await response.blob()
      const container = docxContainerRef.current
      if (!container || cancelled) return
      container.innerHTML = ''
      const { renderAsync } = await import('docx-preview')
      await renderAsync(blob, container, undefined, {
        inWrapper: true,
        className: 'docx',
      })
      if (cancelled) return
      // Cap a MAX_PREVIEW_PAGES "páginas": docx-preview separa en <section class="docx">.
      container
        .querySelectorAll('.docx-wrapper > section.docx')
        .forEach((section, i) => {
          if (i >= MAX_PREVIEW_PAGES) section.remove()
        })
      setAsyncStatus('ready')
    }

    const run = async () => {
      try {
        if (kind === 'pdf') await renderPdf()
        else await renderDocx()
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== 'AbortError') {
          setAsyncStatus('error')
        }
      }
    }

    run()
    return () => {
      cancelled = true
      ac.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, file?.storedFileName, kind])

  return { status, kind, pdfPages, docxContainerRef }
}

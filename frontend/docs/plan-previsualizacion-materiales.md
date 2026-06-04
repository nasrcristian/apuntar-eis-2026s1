# Plan de implementación — Previsualización de materiales (PDF / DOCX)

## Historia de usuario

> Como usuario quiero poder previsualizar el contenido de un material de texto para poder verlo sin necesidad de descargarlo.

### Criterios de aceptación

- En la vista previa de cada material se debe poder ver la primera página o varias de cada material como vista previa.
- Dentro de la previsualización se debe poder desplazar verticalmente para revisar los contenidos sin necesidad de descargar.
- La previsualización del elemento debe cargar como máximo 10 páginas del mismo.
- Si el documento no puede ser previsualizado se debe mostrar un ícono de papel roto con un mensaje de feedback amigable que lleve al usuario a descargarlo.

**Nota:** Solo se previsualizan archivos de tipo `doc` o `pdf`, únicamente en la vista del detalle de material.

---

## Enfoque y decisión confirmada

Feature **100% frontend**. El backend ya sirve los bytes por un endpoint público
(`GET /materiales/{id}/archivos/{storedFileName}`), que devuelve el content-type real.
pdfjs/docx leen esos bytes vía `fetch`, por lo que **el backend no se toca**.
El header `Content-Disposition: attachment` no molesta porque no navegamos directo al archivo.

| Tipo | Estrategia | Dependencia |
|------|-----------|-------------|
| `.pdf` (`application/pdf`) | `pdfjs-dist` — render multipágina a `<img>`, hasta 10 págs | ya instalada |
| `.docx` (`...wordprocessingml.document`) | `docx-preview` — render a DOM, cap a 10 "páginas" | **nueva** (`docx-preview`) |
| `.doc` (`application/msword`) | Fallback "papel roto" + botón Descargar | — |
| videos / sin archivo | No se previsualizan (los maneja `Downloader`) | — |

Se respeta el patrón de `AGENTS.md`: **toda la lógica async/render va en un hook**, el
componente solo presenta, y se reusa el patrón de pdfjs que ya existe en
`MaterialThumbnail.tsx`.

> **Por qué client-side y no conversión a PDF en backend:** el proyecto ya rinde PDF
> en el navegador con `pdfjs-dist`. Cubrir `.docx` con `docx-preview` cubre el ~95% real
> de los documentos sin infra extra (LibreOffice/jodconverter). El `.doc` binario viejo no
> tiene soporte client-side confiable en ninguna librería JS común, y cae al fallback de
> "papel roto" — que es exactamente el caso que el criterio de aceptación contempla.

---

## Archivos

### Nuevos

1. **`frontend/src/utils/filePreview.ts`** — helpers centralizados:
   - `fileUrl(materialId, storedFileName)` (hoy duplicado en `MaterialThumbnail` y `useDownloader`).
   - `getPreviewKind(contentType): 'pdf' | 'docx' | 'unsupported'`.
   - `MAX_PREVIEW_PAGES = 10`.
   - Setup idempotente del `GlobalWorkerOptions.workerSrc` de pdfjs (un solo lugar).
2. **`frontend/src/hooks/useDocumentPreview.ts`** — la lógica de la feature.
3. **`frontend/src/components/MaterialPreview/MaterialPreview.tsx`** — la UI (scroll, estados).
4. **`frontend/src/components/MaterialPreview/MaterialPreview.css`** — contenedor scrollable, espaciado entre páginas.

### Modificados

5. **`frontend/src/components/MaterialDetail/MaterialDetail.tsx`** — montar `<MaterialPreview>` en el `material-detail__pdf-panel`, arriba del `<Downloader>`.
6. **`frontend/package.json`** — `npm install docx-preview` (dentro de `frontend/`).
7. *(Opcional, limpieza)* `MaterialThumbnail.tsx` y `useDownloader.ts` → usar el `fileUrl` de `utils/filePreview.ts` y borrar las copias.

---

## Pasos ordenados

### 1. Instalar dependencia

```bash
cd frontend && npm install docx-preview
```

`docx-preview` trae su propio render y `jszip`; funciona con Vite sin config extra.

### 2. `utils/filePreview.ts`

Centraliza URL, detección de tipo y constante de tope:

```ts
import { GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
GlobalWorkerOptions.workerSrc = pdfWorker            // setup único del worker

export const MAX_PREVIEW_PAGES = 10
const API_BASE = 'http://localhost:8080'

export const fileUrl = (materialId: number, storedFileName: string) =>
  `${API_BASE}/materiales/${materialId}/archivos/${storedFileName}`

export type PreviewKind = 'pdf' | 'docx' | 'unsupported'

export function getPreviewKind(contentType: string): PreviewKind {
  if (contentType === 'application/pdf') return 'pdf'
  if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx'
  return 'unsupported'   // incluye application/msword (.doc) y videos
}
```

### 3. `hooks/useDocumentPreview.ts`

Estados: `'loading' | 'ready' | 'unsupported' | 'error'`. Maneja PDF (devuelve array de
imágenes) y DOCX (renderiza dentro de un `ref` que provee el componente). Reusa el patrón
de cancelación de `MaterialThumbnail` + `AbortController`.

```ts
export function useDocumentPreview(materialId: number, file?: FileMetadataDTO) {
  const [status, setStatus] = useState<'loading'|'ready'|'unsupported'|'error'>('loading')
  const [pdfPages, setPdfPages] = useState<string[]>([])   // dataURLs (igual que el thumbnail)
  const docxContainerRef = useRef<HTMLDivElement>(null)
  const kind = file ? getPreviewKind(file.contentType) : 'unsupported'

  useEffect(() => {
    let cancelled = false
    const ac = new AbortController()
    if (!file || kind === 'unsupported') { setStatus('unsupported'); return }
    setStatus('loading'); setPdfPages([])
    const url = fileUrl(materialId, file.storedFileName)

    const run = async () => {
      try {
        if (kind === 'pdf') {
          const pdf = await getDocument({ url }).promise
          const n = Math.min(pdf.numPages, MAX_PREVIEW_PAGES)   // ← tope 10
          const pages: string[] = []
          for (let p = 1; p <= n; p++) {
            const page = await pdf.getPage(p)
            const viewport = page.getViewport({ scale: 1.3 })
            const canvas = document.createElement('canvas')
            canvas.width = viewport.width; canvas.height = viewport.height
            await page.render({ canvas, viewport }).promise
            pages.push(canvas.toDataURL('image/png'))
            if (cancelled) return
          }
          if (!cancelled) { setPdfPages(pages); setStatus('ready') }
        } else { // docx
          const blob = await (await fetch(url, { signal: ac.signal })).blob()
          const container = docxContainerRef.current
          if (!container || cancelled) return
          const { renderAsync } = await import('docx-preview')
          await renderAsync(blob, container, undefined, { inWrapper: true, className: 'docx' })
          // cap a 10 "páginas": docx-preview separa en <section class="docx">
          container.querySelectorAll('.docx-wrapper > section.docx')
                   .forEach((s, i) => { if (i >= MAX_PREVIEW_PAGES) s.remove() })
          if (!cancelled) setStatus('ready')
        }
      } catch { if (!cancelled) setStatus('error') }
    }
    run()
    return () => { cancelled = true; ac.abort() }
  }, [materialId, file?.storedFileName, kind])

  return { status, kind, pdfPages, docxContainerRef }
}
```

### 4. `components/MaterialPreview/MaterialPreview.tsx`

Recibe `files` + `materialId`, elige el **primer archivo previsualizable** (mismo criterio
que el thumbnail elige `files[0]`), y renderiza según estado:

```tsx
export default function MaterialPreview({ materialId, files }: Props) {
  const target = files.find(f => getPreviewKind(f.contentType) !== 'unsupported') ?? files[0]
  const { status, kind, pdfPages, docxContainerRef } = useDocumentPreview(materialId, target)
  const { downloadFile } = useDownloader()

  if (!target) return null
  if (status === 'loading') return <Skeleton variant="rectangular" height={500} />

  if (status === 'unsupported' || status === 'error')
    return (
      <Box className="material-preview__fallback">
        <BrokenImageIcon sx={{ fontSize: 64, opacity: .5 }} />   {/* "papel roto" */}
        <Typography>No pudimos generar una vista previa de este archivo.</Typography>
        <Button startIcon={<DownloadIcon />}
                onClick={() => downloadFile(materialId, target.storedFileName, target.originalFileName)}>
          Descargar para verlo
        </Button>
      </Box>
    )

  return (
    <Box className="material-preview__scroll">   {/* overflow-y:auto, max-height fija */}
      {kind === 'pdf'
        ? pdfPages.map((src, i) => <img key={i} src={src} className="material-preview__page" />)
        : <div ref={docxContainerRef} className="material-preview__docx" />}
    </Box>
  )
}
```

- Ícono "papel roto": `BrokenImageIcon` de `@mui/icons-material` (el más parecido
  visualmente). Si se quiere exactitud, se reemplaza por un SVG propio de papel roto.

### 5. `MaterialPreview.css`

```css
.material-preview__scroll {
  max-height: 70vh;
  overflow-y: auto;            /* ← scroll vertical */
}
.material-preview__page {
  width: 100%;
  display: block;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
}
.material-preview__fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
}
```

### 6. Montar en `MaterialDetail.tsx`

En el `material-detail__pdf-panel`, arriba del `<Downloader>`:

```tsx
<MaterialPreview materialId={material.id} files={material.files} />
<Downloader files={material.files} videos={material.videos} materialId={material.id} />
```

### 7. *(Opcional)* Limpieza de duplicación

Apuntar `MaterialThumbnail.tsx` y `useDownloader.ts` al `fileUrl` compartido y borrar las
definiciones locales + el setup del worker duplicado.

---

## Cobertura de criterios de aceptación

| Criterio | Cómo se cumple |
|----------|----------------|
| Ver primera o varias páginas como preview | PDF: loop de páginas desde la 1. DOCX: render completo del documento. |
| Desplazamiento vertical | `.material-preview__scroll` con `overflow-y:auto` + `max-height` fija. |
| Máximo 10 páginas | PDF: `Math.min(numPages, 10)`. DOCX: se eliminan los `<section class="docx">` con índice ≥ 10. |
| Papel roto + mensaje + descargar | Estado `unsupported`/`error` → `BrokenImageIcon` + texto amigable + botón Descargar (reusa `useDownloader`). |
| Solo doc/pdf en el detalle | Se monta únicamente en `MaterialDetail`; `getPreviewKind` filtra; videos/otros → fallback. |

---

## Edge cases cubiertos

- **`.doc` legacy** → cae a `unsupported` (papel roto). Comportamiento esperado y aceptado.
- **PDF corrupto / docx inválido** → `catch` → estado `error` → papel roto.
- **Desmontaje a mitad de render** → flag `cancelled` + `AbortController` (evita warnings y renders fantasma).
- **Material sin archivos** → `MaterialPreview` retorna `null`; el `Downloader` ya muestra "No hay archivos".
- **Material con varios PDFs** → se previsualiza el primero previsualizable.
  *(Mejora opcional: hacer clickeables las filas del `Downloader` para elegir cuál previsualizar — estado `activeFile` en `MaterialDetail`.)*

---

## Verificación manual (no hay test runner en el repo)

1. `make up` (backend) + `npm run dev` (frontend), subir y abrir el detalle de:
   - PDF de **>10 páginas** → se ven 10, scrollea, no más.
   - PDF de 1–2 páginas → se ven todas.
   - `.docx` con varias páginas → render + cap a 10.
   - `.doc` → papel roto + Descargar funciona.
   - PDF intencionalmente corrupto → papel roto.
2. Verificar que el `Downloader` sigue funcionando igual debajo.

---

## Limitaciones conocidas

- **`.doc` (binario viejo) nunca se previsualiza** client-side — limitación de las
  librerías JS, no del plan. Va al fallback.
- **El tope de 10 "páginas" en DOCX es best-effort**: `docx-preview` pagina en `<section>`,
  así que el corte es fiable, pero la noción de "página" depende del layout del documento,
  no es idéntica a Word.
- `getDocument` descarga el PDF completo aunque se muestren 10 págs (aceptable con el tope
  de 20 MB por archivo).

---

## Posible entregable incremental

Si se quiere un primer PR más chico: implementar **solo PDF** (pasos 1–6 sin la rama
`docx`), dejando `.docx` también en el fallback de "papel roto", y agregar `docx-preview`
en un segundo PR.

package ar.edu.unq.apuntar.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.util.StopWatch
import ws.schild.jave.EncoderException
import ws.schild.jave.MultimediaObject
import java.nio.file.Path
import java.nio.file.Paths
import java.time.Duration

data class ProbedVideo(
    val duracion: Duration,
    val bitrate: Int?,
    val resolucion: String?,
    val codec: String?
)

@Component
class ProbeMedia(
    @Value("\${storage.path:uploads}") storagePathStr: String
) {
    private val storagePath: Path = Paths.get(storagePathStr)
    private val log = LoggerFactory.getLogger(javaClass)

    fun probe(storedFileName: String): ProbedVideo? {
        val file = storagePath.resolve(storedFileName).toFile()
        if (!file.exists()) {
            log.warn("File not found for probing: {}", file)
            return null
        }

        val watch = StopWatch()
        watch.start()
        return try {
            val info = MultimediaObject(file).info
            val video = info.video

            val duracion = Duration.ofMillis(info.duration)
            val bitrate = video.bitRate
            val resolucion = video.size?.let { "${it.width}x${it.height}" }
            val codec = video.decoder?.takeIf { it.isNotBlank() }

            ProbedVideo(duracion = duracion, bitrate = bitrate, resolucion = resolucion, codec = codec)
        } catch (e: EncoderException) {
            log.warn("Failed to probe video metadata for {}: {}", storedFileName, e.message)
            null
        } finally {
            watch.stop()
            if (watch.totalTimeMillis > 100) {
                log.info("Probing {} took {} ms", storedFileName, watch.totalTimeMillis)
            }
        }
    }
}

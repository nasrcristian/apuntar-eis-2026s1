package ar.edu.unq.apuntar

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.TimeZone

@SpringBootApplication
class ApuntarApplication

fun main(args: Array<String>) {
    //para el PSQL que no para de llorar por la zona horaria
    TimeZone.setDefault(TimeZone.getTimeZone("America/Argentina/Buenos_Aires"))
	runApplication<ApuntarApplication>(*args)
}

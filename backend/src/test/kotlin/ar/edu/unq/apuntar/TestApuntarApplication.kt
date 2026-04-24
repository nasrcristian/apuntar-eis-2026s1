package ar.edu.unq.apuntar

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
	fromApplication<ApuntarApplication>().with(TestcontainersConfiguration::class).run(*args)
}

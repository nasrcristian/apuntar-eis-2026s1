package ar.edu.unq.apuntar.exception

class UserAlreadyExistsException(mail: String) : RuntimeException("El mail: $mail ya existe")
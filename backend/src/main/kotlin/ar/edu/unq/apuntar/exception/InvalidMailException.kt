package ar.edu.unq.apuntar.exception

class InvalidMailException(mail: String) : RuntimeException("El mail $mail no es valido")
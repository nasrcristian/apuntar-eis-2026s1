package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.LoginReqDto

interface AuthService {

    fun login(request: LoginReqDto): String
}
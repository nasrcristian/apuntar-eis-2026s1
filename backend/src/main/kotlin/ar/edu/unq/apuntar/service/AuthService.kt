package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.auth.LoginReqDto

interface AuthService {

    fun login(request: LoginReqDto): String
    fun requestPasswordReset(mail: String): String?
    fun resetPassword(token: String, newPassword: String)
}
package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.persistence.repository.UserRepository

class UserServiceImpl(private val repository: UserRepository) {

    fun getUsers() = repository.getUsers();

}
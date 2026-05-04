import { useState } from 'react'
import { useNavigate } from 'react-router'
import { postRegister } from '../../service/api'
import type { ApiErrorDto } from '../../types/dto'
import './Register.css'

function Register() {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const navigate = useNavigate()

    const validateEmail = (email: string) => {
        const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")
        return regex.test(email)
    }

    const clearError = (field: string) => {
        setErrors(prev => {
            if (!prev[field]) return prev
            const next = { ...prev }
            delete next[field]
            return next
        })
    }

    const validate = (): Record<string, string> => {
        const errs: Record<string, string> = {}
        if (!name) errs.name = 'El nombre no puede ser vacío'
        if (!surname) errs.surname = 'El apellido no puede ser vacío'
        if (!mail) errs.mail = 'El email no puede ser vacío'
        else if (!validateEmail(mail)) errs.mail = 'Email inválido'
        if (!password) errs.password = 'Se requiere una contraseña'
        else if (password.length < 8) errs.password = 'La contraseña debe tener al menos 8 caracteres'
        if (password !== passwordConfirmation) errs.passwordConfirmation = 'Las contraseñas no coinciden'
        return errs
    }

    const handleRegister = () => {
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})

        postRegister({ name, surname, mail, password })
            .then((response) => {
                console.log(response)
                navigate('/')
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 409) {
                        setErrors({ mail: 'El email ya está registrado' })
                        return
                    }
                    if (e.response.status === 400) {
                        const apiError = e.response.data as ApiErrorDto
                        if (apiError.validationErrors && apiError.validationErrors.length > 0) {
                            const serverErrors: Record<string, string> = {}
                            apiError.validationErrors.forEach(ve => {
                                serverErrors[ve.field] = ve.error
                            })
                            setErrors(serverErrors)
                        } else {
                            setErrors({ _form: apiError.message || 'Los datos ingresados no son válidos' })
                        }
                        return
                    }
                }
                setErrors({ _form: 'Error de conexión' })
            })
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <h1 className="register-title">Registrarse</h1>
                {errors._form && <p className="register-error-message register-form-error">{errors._form}</p>}
                <div className="register-field">
                    <label htmlFor="name" className="register-label">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ingresa tu nombre"
                        className={`register-input ${errors.name ? 'register-input-error' : ''}`}
                        value={name}
                        onChange={(e) => { clearError('name'); setName(e.target.value) }}
                    />
                    {errors.name && <p className="register-error-message register-field-error">{errors.name}</p>}
                </div>
                <div className="register-field">
                    <label htmlFor="surname" className="register-label">Apellido</label>
                    <input
                        type="text"
                        id="surname"
                        placeholder="Ingresa tu apellido"
                        className={`register-input ${errors.surname ? 'register-input-error' : ''}`}
                        value={surname}
                        onChange={(e) => { clearError('surname'); setSurname(e.target.value) }}
                    />
                    {errors.surname && <p className="register-error-message register-field-error">{errors.surname}</p>}
                </div>
                <div className="register-field">
                    <label htmlFor="mail" className="register-label">Email</label>
                    <input
                        type="email"
                        id="mail"
                        placeholder="Ingresa tu email"
                        className={`register-input ${errors.mail ? 'register-input-error' : ''}`}
                        value={mail}
                        onChange={(e) => { clearError('mail'); setMail(e.target.value) }}
                    />
                    {errors.mail && <p className="register-error-message register-field-error">{errors.mail}</p>}
                </div>
                <div className="register-field">
                    <label htmlFor="password" className="register-label">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Ingresa tu contraseña"
                        className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                        value={password}
                        onChange={(e) => { clearError('password'); setPassword(e.target.value) }}
                        onCopy={(e) => e.preventDefault}
                        onCut={(e) => e.preventDefault}
                    />
                    {errors.password && <p className="register-error-message register-field-error">{errors.password}</p>}
                </div>
                <div className="register-field">
                    <label htmlFor="passwordConfirmation" className="register-label">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="passwordConfirmation"
                        placeholder="Confirmá tu contraseña"
                        className={`register-input ${errors.passwordConfirmation ? 'register-input-error' : ''}`}
                        value={passwordConfirmation}
                        onChange={(e) => { clearError('passwordConfirmation'); setPasswordConfirmation(e.target.value) }}
                        onPaste={(e) => e.preventDefault}
                    />
                    {errors.passwordConfirmation && <p className="register-error-message register-field-error">{errors.passwordConfirmation}</p>}
                </div>
                <button className="register-button" onClick={handleRegister}>Crear Cuenta</button>
            </div>
        </div>
    )
}

export default Register

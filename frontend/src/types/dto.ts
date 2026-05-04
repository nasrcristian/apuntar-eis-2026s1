export interface RegisterReqDto {
    name: string
    surname: string
    mail: string
    password: string
}

export interface UserDto {
    name: string
    surname: string
    mail: string
}

export interface ValidationError {
    field: string
    error: string
}

export interface ApiErrorDto {
    path: string
    status: number
    message: string
    timestamp: string
    validationErrors?: ValidationError[]
}

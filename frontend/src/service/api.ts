import axios, { type AxiosResponse } from "axios"
import type { RegisterReqDto, UserDto } from "../types/dto"

const urlApi = "http://localhost:8080/"

export interface ResolvedResponse<T> {
    headers: Record<string, string>
    status: number
    statusText: string
    data: T
}

export interface ErrorResponse {
    code: string
    message: string
    response: AxiosResponse | undefined
}

const handleResolvedResponse = <T>(response: AxiosResponse<T>): ResolvedResponse<T> => {
    return {
        headers: response.headers as Record<string, string>,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
    }
}

const handleErrorResponse = (error: {
    code: string
    message: string
    response?: AxiosResponse
}): ErrorResponse => {
    throw { code: error.code, message: error.message, response: error.response }
}

const post = <T, R>(url: string, data: T): Promise<ResolvedResponse<R>> =>(axios.post<R>(url, data)
        .then((response) => handleResolvedResponse(response))
        .catch((error) => {
            throw handleErrorResponse(error)
        }))

const get = <R>(url: string): Promise<ResolvedResponse<R>> => (axios.get<R>(url))
                .then((response) => handleResolvedResponse(response))
                .catch((error) => {
                    throw handleErrorResponse(error)
                })

        
export const postRegister = (data: RegisterReqDto): Promise<ResolvedResponse<UserDto>> =>
    post<RegisterReqDto, UserDto>(`${urlApi}user`, data)

export const getMaterial = (id: String): Promise<ResolvedResponse<MaterialDTO>> => 
    get<MaterialDTO>(`${urlApi}/materiales/${id}`)

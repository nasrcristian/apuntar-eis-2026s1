import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type {
  MaterialDTO,
  ReactionSummaryDTO,
  ReactionDTO,
  CommentDTO,
  AddCommentDTO,
} from "../types/material";
import type {
  RegisterReqDto,
  UserDto,
  ForgotPasswordReqDto,
  ForgotPasswordResDto,
  ResetPasswordReqDto,
  ResetPasswordResDto,
  ReactToMaterialDTO,

  // MaterialFormData,
  // MaterialUploadResDto,
} from "../types/dto";
const token = localStorage.getItem("jwt");

const urlApi = "http://localhost:8080";

export interface ResolvedResponse<T> {
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
}

export interface ErrorResponse {
  code: string;
  message: string;
  response: AxiosResponse | undefined;
}

const handleResolvedResponse = <T>(
  response: AxiosResponse<T>,
): ResolvedResponse<T> => {
  return {
    headers: response.headers as Record<string, string>,
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  };
};

const handleErrorResponse = (error: {
  code: string;
  message: string;
  response?: AxiosResponse;
}): ErrorResponse => {
  throw { code: error.code, message: error.message, response: error.response };
};

const post = <T, R>(url: string, data: T): Promise<ResolvedResponse<R>> =>
  axios
    .post<R>(url, data)
    .then((response) => handleResolvedResponse(response))
    .catch((error) => {
      throw handleErrorResponse(error);
    });

const get = <R>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ResolvedResponse<R>> =>
  axios
    .get<R>(url, config) // Axios recibe aquí los headers, interceptores o params
    .then((response) => handleResolvedResponse(response))
    .catch((error) => {
      throw handleErrorResponse(error);
    });

const del = <R>(
  url: string,
  config: AxiosRequestConfig,
): Promise<ResolvedResponse<R>> =>
  axios
    .delete<R>(url, config)
    .then((response) => handleResolvedResponse(response))
    .catch((error) => {
      throw handleErrorResponse(error);
    });

export const postRegister = (
  data: RegisterReqDto,
): Promise<ResolvedResponse<UserDto>> =>
  post<RegisterReqDto, UserDto>(`${urlApi}/user`, data);

export const getMaterial = (
  id: String | number,
): Promise<ResolvedResponse<MaterialDTO>> =>
  get<MaterialDTO>(`${urlApi}/materiales/${id}`);

export const postForgotPassword = (
  mail: string,
): Promise<ResolvedResponse<ForgotPasswordResDto>> =>
  post<ForgotPasswordReqDto, ForgotPasswordResDto>(
    `${urlApi}api/auth/forgot-password`,
    { mail },
  );

export const postResetPassword = (
  token: string,
  newPassword: string,
): Promise<ResolvedResponse<ResetPasswordResDto>> =>
  post<ResetPasswordReqDto, ResetPasswordResDto>(
    `${urlApi}api/auth/reset-password`,
    { token, newPassword },
  );

export const getAllMaterials = (): Promise<ResolvedResponse<MaterialDTO[]>> =>
  get<MaterialDTO[]>(`${urlApi}/materiales`);

export const deleteMaterial = (
  id: string | number,
): Promise<ResolvedResponse<void>> =>
  del<void>(`${urlApi}/materiales/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Reemplaza 'token' por tu variable, store o localStorage
    },
  });

export const getMaterialFiltrado = (
  detalle: string,
): Promise<ResolvedResponse<MaterialDTO[]>> =>
  get<MaterialDTO[]>(
    `${urlApi}/materiales/filtrado?detalle=${encodeURIComponent(detalle)}`,
  );

export const getReactionSummary = (
  materialId: number,
): Promise<ResolvedResponse<ReactionSummaryDTO>> =>
  get<ReactionSummaryDTO>(
    `${urlApi}/materiales/${materialId}/reactions/summary`,
  );

export const reactToMaterial = (
  materialId: number,
  type: "LIKE" | "DISLIKE",
): Promise<ResolvedResponse<ReactionDTO>> =>
  post<ReactToMaterialDTO, ReactionDTO>(
    `${urlApi}/materiales/${materialId}/reactions`,
    { type },
  );

export const removeReaction = (
  materialId: number,
): Promise<ResolvedResponse<void>> =>
  del<void>(`${urlApi}/materiales/${materialId}/reactions`, {
    headers: {
      Authorization: `Bearer ${token}`, // Reemplaza 'token' por tu variable, store o localStorage
    },
  });

export const getComments = (
  materialId: number,
): Promise<ResolvedResponse<CommentDTO[]>> =>
  get<CommentDTO[]>(`${urlApi}/materiales/${materialId}/comments`);

export const addComment = (
  materialId: number,
  text: string,
  authorName: string,
): Promise<ResolvedResponse<CommentDTO>> =>
  post<AddCommentDTO, CommentDTO>(
    `${urlApi}/materiales/${materialId}/comments`,
    { text, authorName },
  );

export const deleteComment = (
  materialId: number,
  commentId: string,
): Promise<ResolvedResponse<void>> =>
  del<void>(`${urlApi}/materiales/${materialId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Terminar de factorizar esto
// export const uploadMaterial = (form: MaterialFormData): Promise<ResolvedResponse<MaterialUploadResDto>> => post<MaterialFormData, MaterialUploadResDto>();

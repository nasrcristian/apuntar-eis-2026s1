export interface RegisterReqDto {
  name: string;
  surname: string;
  mail: string;
  password: string;
}

export interface UserDto {
  name: string;
  surname: string;
  mail: string;
  description?: string;
}

export interface ValidationError {
  field: string;
  error: string;
}

export interface ApiErrorDto {
  path: string;
  status: number;
  message: string;
  timestamp: string;
  validationErrors?: ValidationError[];
}

export interface ForgotPasswordReqDto {
  mail: string;
}

export interface ForgotPasswordResDto {
  message: string;
  token: string | null;
}

export interface ResetPasswordReqDto {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResDto {
  message: string;
}

export interface DeleteMaterialReqDto {
  id: string | number;
}

export interface DeleteMaterialResDto {
  message: string;
}

export interface MaterialFiltradoReqDto {
  detalle: string;
  type: number;
}

export interface MaterialFormData {
  titulo: string;
  descripcion: string;
  materia: string;
  carrera: string;
  tema: string;
  categoria: string;
  files: File[];
}

export interface MaterialUploadResDto {
  message: string;
}

export interface ReactToMaterialDTO {
  type: "LIKE" | "DISLIKE";
}

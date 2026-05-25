export interface FileMetadataDTO {
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  size: number;
}

export interface VideoMetadataDTO {
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  size: number;
  duracion: string | null;
  bitrate: number | null;
  resolucion: string | null;
  codec: string | null;
}

export interface MaterialDTO {
  id: number;
  ownerMail: string,
  title: string;
  description: string;
  subject: string;
  career: string;
  category: string;
  topic: string;
  author: string;
  likes: number;
  dislikes: number;
  files: FileMetadataDTO[];
  videos: VideoMetadataDTO[];
  createdAt: string;
}

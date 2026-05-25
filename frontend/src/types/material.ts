export type Reaction = "LIKE" | "DISLIKE" | null;

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

export interface ReactionDTO {
  materialId: number;
  userId: string;
  type: "LIKE" | "DISLIKE";
  createdAt: Date;
}

export interface ReactionSummaryDTO {
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
}

export interface CommentDTO {
  id: string;
  materialId: number;
  userId: string;
  text: string;
  createdAt: Date;
  authorName: string;
}

export interface AddCommentDTO {
  text: string;
  authorName: string;
}

export interface CurrentUser {
  mail: string;
  name: string;
  surname: string;
}

export interface MaterialSidebarProps {
  material: MaterialDTO;
  reactions: ReactionSummaryDTO;
  fetchReactions: () => void;
  currentUser: CurrentUser;
}

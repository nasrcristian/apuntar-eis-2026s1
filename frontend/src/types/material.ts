export interface FileMetadataDTO {
  originalFileName: string
  storedFileName: string
  contentType: string
  size: number
}

export interface MaterialDTO {
  id: number
  title: string
  description: string
  subject: string
  career: string
  category: string
  topic: string
  author: string
  reactions: {
    likes: number
    dislikes: number
  }
  files: FileMetadataDTO[]
  createdAt: string
}

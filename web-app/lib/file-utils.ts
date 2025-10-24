import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./constants"

export interface FileValidationResult {
  isValid: boolean
  error?: {
    title: string
    description: string
  }
}

export function validateFile(file: File): FileValidationResult {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: {
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file",
      },
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: {
        title: "File too large",
        description: "Maximum file size is 10MB",
      },
    }
  }

  return { isValid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function getFileIcon(type: string): "pdf" | "image" {
  if (type === "application/pdf") return "pdf"
  return "image"
}

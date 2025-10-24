export interface UploadExpenseRequest {
  file: File
}

export interface UploadExpenseResponse {
  success: boolean
  message?: string
  data?: {
    fileId?: string
    fileName?: string
    uploadedAt?: string
  }
  error?: string
}

export interface WebhookError {
  message: string
  statusCode?: number
}

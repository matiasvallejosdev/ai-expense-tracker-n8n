import type { UploadExpenseResponse, WebhookError } from "@/types/api"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:5678/webhook-test/upload-expense"

export class ExpenseService {
  /**
   * Uploads an expense file to the n8n webhook
   * @param file - The file to upload (PDF, JPG, PNG)
   * @returns Promise with upload response
   * @throws WebhookError if upload fails
   */
  static async uploadExpense(file: File): Promise<UploadExpenseResponse> {
    try {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", file.name)
      formData.append("fileType", file.type)
      formData.append("fileSize", file.size.toString())
      formData.append("uploadedAt", new Date().toISOString())

      // Send request to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      })

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text()
        throw {
          message: `Upload failed: ${response.statusText}`,
          statusCode: response.status,
        } as WebhookError
      }

      // Parse response
      const data = await response.json()

      return {
        success: true,
        message: "File uploaded successfully",
        data: {
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          ...data,
        },
      }
    } catch (error) {
      // Handle network errors or other exceptions
      if ((error as WebhookError).statusCode) {
        throw error
      }

      throw {
        message: error instanceof Error ? error.message : "Network error occurred",
        statusCode: 0,
      } as WebhookError
    }
  }

  /**
   * Test webhook connectivity
   * @returns Promise<boolean> indicating if webhook is reachable
   */
  static async testWebhook(): Promise<boolean> {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "GET",
      })
      return response.ok || response.status === 405 // 405 = Method Not Allowed is OK (means endpoint exists)
    } catch {
      return false
    }
  }
}

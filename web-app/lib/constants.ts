export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

export const FILE_UPLOAD_CONFIG = {
  maxSize: MAX_FILE_SIZE,
  allowedTypes: ALLOWED_FILE_TYPES,
  acceptedExtensions: ".pdf,.jpg,.jpeg,.png",
} as const

// Google Sheets Dashboard
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://docs.google.com/spreadsheets/d/1CxrFIACqAUA7uu7fivSMhzzHtaIfcpxcIVr4NxnCObo/edit"

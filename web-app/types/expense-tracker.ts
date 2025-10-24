export type StepNumber = 1 | 2 | 3

export interface WelcomeStepProps {
  onGetStarted: () => void
}

export interface UploadStepProps {
  onBack: () => void
  onFileSelect: (file: File) => void
  onProcessComplete: () => void
  selectedFile: File | null
}

export interface SuccessStepProps {
  fileName: string
  onUploadAnother: () => void
}

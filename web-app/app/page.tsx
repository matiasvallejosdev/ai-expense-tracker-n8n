"use client";
import { useState } from "react";
import WelcomeStep from "@/components/features/expense-tracker/welcome-step";
import UploadStep from "@/components/features/expense-tracker/upload-step";
import SuccessStep from "@/components/features/expense-tracker/success-step";
import type { StepNumber } from "@/types/expense-tracker";

export default function ExpenseTrackerPage() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleGetStarted = () => {
    setCurrentStep(2);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleProcessComplete = () => {
    setCurrentStep(3);
  };

  const handleUploadAnother = () => {
    setUploadedFile(null);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setUploadedFile(null);
    }
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[430px]">
        {currentStep === 1 && <WelcomeStep onGetStarted={handleGetStarted} />}
        {currentStep === 2 && (
          <UploadStep
            onBack={handleBack}
            onFileSelect={handleFileUpload}
            onProcessComplete={handleProcessComplete}
            selectedFile={uploadedFile}
          />
        )}
        {currentStep === 3 && uploadedFile && (
          <SuccessStep
            fileName={uploadedFile.name}
            onUploadAnother={handleUploadAnother}
          />
        )}
      </div>
    </div>
  );
}

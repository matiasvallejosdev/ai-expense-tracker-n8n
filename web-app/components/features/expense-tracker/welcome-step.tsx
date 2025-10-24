"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Receipt,
  Sparkles,
  BarChart3,
  Cloud,
  Shield,
  Coffee,
  Github,
  Globe,
  Wallet,
  FolderInput,
  Table2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { WelcomeStepProps } from "@/types/expense-tracker";
import { DASHBOARD_URL } from "@/lib/constants";

export default function WelcomeStep({ onGetStarted }: WelcomeStepProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="p-6 shadow-lg border-0 bg-card relative">
        <div className="absolute top-4 right-4">
          <a
            href="https://github.com/matiasvallejosdev/ai-expense-tracker-n8n"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* App Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary flex items-center justify-center shadow-lg">
            <span className="text-4xl">💸</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-center mb-2 text-balance">
          Track Your Expenses
        </h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground mb-5 text-sm text-pretty leading-relaxed">
          Upload receipts and let AI categorize them automatically
        </p>

        {/* Benefit Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent/80"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI-Powered
          </Badge>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent/80"
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Auto-Categorize
          </Badge>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent/80"
          >
            <Cloud className="w-3.5 h-3.5 mr-1.5" />
            Cloud Backup
          </Badge>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onGetStarted}
          className="w-full h-11 text-base font-medium shadow-sm"
          size="lg"
        >
          Get Started
        </Button>

        {/* Secondary Actions */}
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            className="w-full h-10 text-sm font-normal"
            asChild
          >
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Dashboard
            </a>
          </Button>

          <Button
            onClick={() => setIsGuideOpen(true)}
            variant="ghost"
            className="w-full h-10 text-sm font-normal"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Setup Guide
          </Button>
        </div>

        <div className="mt-5 pt-4 border-t border-border">
          <div className="text-center space-y-2">
            <p className="text-xs font-medium text-foreground">
              Created by Matías Vallejos
            </p>
            <div className="flex flex-col gap-1.5 items-center">
              <a
                href="https://buymeacoffee.com/matiasvallejosdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>buymeacoffee.com/matiasvallejosdev</span>
              </a>
              <a
                href="https://matiasvallejos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>matiasvallejos.com</span>
              </a>
              <a
                href="https://x.com/mativallejosdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@mativallejosdev</span>
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Setup Guide Dialog */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quick Setup Guide</DialogTitle>
            <DialogDescription>
              Follow these steps to connect your Google Drive and Sheets for
              automatic expense tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Google Drive Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FolderInput className="w-5 h-5 text-primary" />
                <span>Google Drive (Input Folder)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload your bank or credit card PDFs here.
              </p>
              <a
                href="https://drive.google.com/drive/folders/16G0cnl6PA_ds68Q-sj4-E71sdmt8K0Jp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span>Drive Folder — AI Expense Tracker Inputs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  Folder ID: 16G0cnl6PA_ds68Q-sj4-E71sdmt8K0Jp
                </p>
              </div>
            </div>

            {/* Google Sheets Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Table2 className="w-5 h-5 text-primary" />
                <span>Google Sheets (Output Dashboard)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All parsed and categorized transactions are appended here.
              </p>
              <a
                href="https://docs.google.com/spreadsheets/d/1CxrFIACqAUA7uu7fivSMhzzHtaIfcpxcIVr4NxnCObo/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span>Google Sheets Template — AI Expense Tracker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/1CxrFIACqAUA7uu7fivSMhzzHtaIfcpxcIVr4NxnCObo/copy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                <span>Make a Copy of the Template</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  Spreadsheet ID: 1CxrFIACqAUA7uu7fivSMhzzHtaIfcpxcIVr4NxnCObo
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

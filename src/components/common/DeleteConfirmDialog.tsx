"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =============================================
   삭제 확인 다이얼로그 컴포넌트
   - 텍스트 입력 확인 필요
   ============================================= */

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  confirmLabel = "삭제하려면 아래 텍스트를 정확히 입력하세요",
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue === confirmText) {
      onConfirm();
      onOpenChange(false);
      setInputValue("");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInputValue("");
    }
    onOpenChange(open);
  };

  const isValid = inputValue === confirmText;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span>{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-input" className="text-sm text-muted-foreground">
            {confirmLabel}
          </Label>
          <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm font-semibold">
            {confirmText}
          </div>
          <Input
            id="confirm-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="여기에 입력하세요"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

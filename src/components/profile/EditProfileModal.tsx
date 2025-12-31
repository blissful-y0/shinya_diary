"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { uploadImage } from "@/lib/api/client";
import styled from "styled-components";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentAvatarUrl: string | null;
  onSave: (nickname: string, avatarUrl: string | null) => Promise<boolean>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentNickname,
  currentAvatarUrl,
  onSave,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const result = await uploadImage(file, "avatars");

    if (result.success && result.data) {
      setAvatarUrl(result.data.url);
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!nickname.trim()) return;

    setIsSaving(true);
    const success = await onSave(nickname.trim(), avatarUrl);
    setIsSaving(false);

    if (success) {
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase() || "U";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>

        <FormContainer>
          {/* 아바타 수정 */}
          <AvatarSection>
            <AvatarWrapper onClick={handleAvatarClick}>
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || ""} alt="프로필" />
                <AvatarFallback>{getInitials(nickname)}</AvatarFallback>
              </Avatar>
              <CameraOverlay>
                <Camera size={20} />
              </CameraOverlay>
              {isUploading && <UploadingOverlay>업로드 중...</UploadingOverlay>}
            </AvatarWrapper>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <AvatarHint>사진을 탭하여 변경</AvatarHint>
          </AvatarSection>

          {/* 닉네임 수정 */}
          <InputSection>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </InputSection>

          {/* 저장 버튼 */}
          <ButtonSection>
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={!nickname.trim() || isSaving || isUploading}
            >
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </ButtonSection>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 16px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const AvatarWrapper = styled.button`
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
`;

const CameraOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UploadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const AvatarHint = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

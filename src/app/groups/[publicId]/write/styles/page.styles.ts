import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 20px;
  gap: 24px;
  background-color: #ffffff;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  background-color: #171717;
  color: #ffffff;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;

  &:hover {
    background-color: #000000;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    background-color: #a3a3a3;
  }
`;

export const ImageUploadArea = styled.div`
  aspect-ratio: 16/9;
  background-color: #fafafa;
  border: 1px dashed #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f5f5f5;
    border-color: #a3a3a3;
  }
`;

export const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f5f5f5;
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  backdrop-filter: blur(4px);

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a3a3a3;
  gap: 12px;
`;

export const UploadText = styled.span`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const ProgressText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #171717;
  font-family: var(--font-sans);
`;

export const ContentTextarea = styled(Textarea)`
  flex: 1;
  min-height: 240px;
  resize: none;
  border: none;
  background-color: transparent;
  
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 2.0rem;
  
  background-image: linear-gradient(transparent 95%, #f0f0f0 95%);
  background-size: 100% 2.0rem;
  background-attachment: local;
  
  padding: 0;
  margin-top: 8px;
  
  &:focus {
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: #d4d4d4;
    font-style: italic;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

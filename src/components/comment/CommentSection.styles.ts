import styled from "styled-components";
import { Button } from "@/components/ui/button";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const EmptyState = styled.p`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #a3a3a3;
  text-align: center;
  padding: 24px 0;
  font-style: normal;
  font-family: var(--font-sans);
`;

export const CommentItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #a3a3a3;
`;

export const CommentBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const Nickname = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #171717;
`;

export const TimeAgo = styled.span`
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #a3a3a3;
`;

export const EditedBadge = styled.span`
  font-size: 10px;
  font-weight: 300;
  color: #a3a3a3;
`;

export const Content = styled.p`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #404040;
  line-height: 1.6;
  word-break: break-word;
  font-family: var(--font-sans);
`;

export const Actions = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 6px;
`;

export const ActionButton = styled.button`
  font-size: 11px;
  font-weight: 400;
  color: #a3a3a3;
  cursor: pointer;
  padding: 4px 0;
  height: 24px;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    color: #171717;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 8px;
`;

export const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #e5e5e5;
  border-radius: 22px; /* Pill shape input */
  background: #ffffff;
  color: #171717;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:focus {
    border-color: #171717;
    background: #ffffff;
  }

  &::placeholder {
    color: #d4d4d4;
  }

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SubmitButton = styled(Button)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  color: #fff;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    background: #000000;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #e5e5e5;
    color: #ffffff;
  }
`;

export const EditInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

export const EditTextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #ffffff;
  color: #171717;
  resize: none;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: #171717;
  }
`;

export const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;

  button {
    margin: 0;
  }
`;

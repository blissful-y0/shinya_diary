import styled from "styled-components";
import { Button } from "@/components/ui/button";

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CharCount = styled.span`
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: #a3a3a3;
  text-align: right;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const CancelButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.02em;
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #737373;
  transition: all 0.2s ease;

  &:hover {
    background: #fafafa;
    border-color: #d4d4d4;
    color: #171717;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const CreateButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: #171717;
  color: #fff;
  border: 1px solid #171717;
  transition: all 0.2s ease;

  &:hover {
    background: #000000;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #e5e5e5;
    border-color: #e5e5e5;
    color: #ffffff;
  }
`;

export const CompletedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px;
`;

export const SuccessMessage = styled.p`
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.6;
  color: #404040;
`;

export const InviteCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InviteCodeLabel = styled.span`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #737373;
`;

export const InviteCodeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fafafa;
  border: 1px dashed #d4d4d4;
  border-radius: 4px;
`;

export const InviteCode = styled.span`
  flex: 1;
  font-size: 22px;
  font-weight: 500;
  font-family: monospace;
  letter-spacing: 3px;
  color: #171717;
`;

export const CopyButton = styled(Button)`
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  background: #ffffff;
  color: #171717;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;

  &:hover {
    background: #fafafa;
    border-color: #d4d4d4;
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const InviteCodeHint = styled.span`
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: #a3a3a3;
`;

export const CompleteButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: #171717;
  color: #fff;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    background: #000000;
  }

  &:active {
    transform: scale(0.98);
  }
`;

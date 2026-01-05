import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CodeInput = styled(Input)`
  font-size: 14px;
  font-family: monospace;
  text-align: left;
  letter-spacing: 2px;
  height: 48px;
  border-radius: 4px;
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #ef4444; /* Keep red for errors but ensure it's readable */
  font-weight: 300;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const CancelButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #737373;
  
  &:hover {
    background: #fafafa;
    color: #171717;
  }
`;

export const SearchButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  border-radius: 4px;
  background: #171717;
  color: #ffffff;
  
  &:hover {
    background: #000000;
  }
`;

export const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

export const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
`;

export const GroupIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  color: #171717;
`;

export const GroupName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #171717;
  font-family: var(--font-sans);
`;

export const MemberCount = styled.span`
  font-size: 14px;
  color: #737373;
  font-family: var(--font-sans);
`;

export const InfoText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #737373;
  line-height: 1.6;
  font-weight: 300;
`;

export const RequestButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  border-radius: 4px;
  background: #171717;
  color: #ffffff;
  
  &:hover {
    background: #000000;
  }
`;

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
`;

export const SuccessIcon = styled.div`
  color: #171717;
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

export const SuccessTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #171717;
  font-family: var(--font-sans);
`;

export const SuccessText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #737373;
  line-height: 1.6;
  font-weight: 300;
`;

export const CompleteButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
  height: 48px;
  border-radius: 4px;
  background: #171717;
  color: #ffffff;
  
  &:hover {
    background: #000000;
  }
`;

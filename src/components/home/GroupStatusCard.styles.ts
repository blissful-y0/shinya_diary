import styled from "styled-components";

export const Container = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  padding: 24px;
  border: 1px solid #f5f5f5;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #171717;
  letter-spacing: 0.02em;
`;

export const Count = styled.span`
  font-size: 13px;
  color: #737373;
  background-color: #f5f5f5;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #fafafa;

  &:last-child {
    border-bottom: none;
  }
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MemberName = styled.span`
  font-size: 14px;
  color: #404040;
  font-weight: 400;
`;

export const StatusIndicator = styled.div<{ $isComplete: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isComplete ? '#4ade80' : '#d4d4d4'};
  background-color: ${props => props.$isComplete ? 'rgba(74, 222, 128, 0.1)' : '#fafafa'};
`;

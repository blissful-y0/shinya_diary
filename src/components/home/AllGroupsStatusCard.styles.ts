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

export const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GroupItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ffffff;
    border-color: #e5e5e5;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const GroupIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  color: #525252;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const GroupName = styled.span`
  font-size: 14px;
  color: #404040;
  font-weight: 500;
`;

export const StatusIndicator = styled.div<{ $isComplete: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isComplete ? '#4ade80' : '#d4d4d4'};
  background-color: ${props => props.$isComplete ? 'rgba(74, 222, 128, 0.1)' : 'rgba(212, 212, 212, 0.1)'};
  transition: all 0.3s ease;
`;

export const EmptyState = styled.div`
  padding: 32px 0;
  text-align: center;
  color: #a3a3a3;
  font-size: 14px;
`;

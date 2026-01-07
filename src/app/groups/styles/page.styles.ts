import styled, { keyframes } from "styled-components";

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const drawLine = keyframes`
  from {
    width: 0;
  }
  to {
    width: 24px;
  }
`;

export const Container = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeIn} 0.5s ease-out;
  background-color: #ffffff;
  min-height: 100vh;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.02em;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const ActionButton = styled.button<{ variant?: "outline" | "solid" }>`
  flex: 1;
  height: 52px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 4px; /* Sharper corners */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  min-height: 48px;
  font-family: var(--font-sans);
  
  ${({ variant }) =>
    variant === "outline"
      ? `
    background: transparent;
    color: #171717;
    border: 1px solid #e5e5e5;
    
    &:hover {
      border-color: #171717;
      background: #fafafa;
    }
    
    &:active {
      transform: scale(0.99);
    }
  `
      : `
    background: #171717;
    color: #ffffff;
    border: 1px solid #171717;
    
    &:hover {
      background: #000000;
    }
    
    &:active {
      transform: scale(0.99);
    }
  `}
  
  svg {
    opacity: 0.9;
    width: 18px;
    height: 18px;
  }
`;

export const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  animation-delay: 0.1s;
  animation-fill-mode: both;
`;

export const LoadingText = styled.p`
  text-align: center;
  padding: 48px 0;
  color: #a3a3a3;
  font-size: 14px;
  letter-spacing: 0.02em;
  font-weight: 300;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #a3a3a3;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  animation-delay: 0.15s;
  animation-fill-mode: both;
`;

export const EmptyIcon = styled.div`
  color: #d4d4d4;
  opacity: 1;
  margin-bottom: 24px;
  
  &::after {
    content: "";
    display: block;
    width: 24px;
    height: 1px;
    background: #171717;
    margin: 24px auto 0;
    animation: ${drawLine} 0.6s ease-out 0.4s both;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #171717;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
  font-family: var(--font-sans);
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: #737373;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.01em;
`;

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
    width: 40px;
  }
`;

export const Container = styled.div`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeIn} 0.8s ease-out;
  padding-bottom: 100px;
`;

export const DateSection = styled.section`
  text-align: left;
  padding: 12px 0;
  animation: ${floatUp} 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  position: relative;
`;

export const DateDisplay = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: #171717;
  letter-spacing: -1px;
  line-height: 1.1;
  margin-bottom: 8px;
  font-family: var(--font-sans);
`;

export const DayOfWeek = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #737373;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  &::after {
    content: "";
    display: block;
    height: 1px;
    background: #171717;
    animation: ${drawLine} 0.8s ease-out 0.4s both;
  }
`;

export const DashboardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${floatUp} 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  animation-fill-mode: both;
  animation-delay: 0.1s;
`;

export const PlaceholderCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
  padding: 32px 24px;
  text-align: center;
`;

export const PlaceholderText = styled.p`
  font-size: 14px;
  color: #a3a3a3;
  line-height: 1.7;
`;

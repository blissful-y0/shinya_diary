import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 20px 16px;
  border-radius: 4px;
  border: 1px solid #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
`;

export const Label = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a3a3a3;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const Value = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #171717;
  font-family: var(--font-sans);
  
  span {
    font-size: 14px;
    font-weight: 400;
    color: #737373;
    margin-left: 2px;
  }
`;

export const LoadingPlaceholder = styled.div`
  height: 24px;
  width: 60px;
  background-color: #f5f5f5;
  border-radius: 2px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

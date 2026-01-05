import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
`;

export const NavButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ disabled }) =>
    disabled ? "#a3a3a3" : "#171717"};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background-color: #fafafa;
    border-color: #e5e5e5;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.96);
  }
`;

export const DateDisplay = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px; /* Pill shape */
  cursor: pointer;
  transition: all 0.2s ease;
  color: #737373;
  position: relative;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;

  &:hover {
    background-color: #f5f5f5;
    border-color: #d4d4d4;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const DateText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #171717;
  font-family: var(--font-sans);
  letter-spacing: 0.02em;
`;

export const TodayBadge = styled.span`
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background-color: #171717;
  border-radius: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

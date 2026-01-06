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
  margin-bottom: 24px;
`;

export const MonthTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #171717;
  letter-spacing: 0.02em;
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  color: #737373;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
    color: #171717;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

export const WeekDay = styled.div`
  text-align: center;
  font-size: 12px;
  color: #a3a3a3;
  padding-bottom: 8px;
  font-weight: 500;
`;

interface DayProps {
  $isToday?: boolean;
  $hasWritten?: boolean;
  $isCurrentMonth?: boolean;
}

export const DayCell = styled.div<DayProps>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-radius: 50%;
  cursor: default;
  transition: all 0.2s ease;
  position: relative;
  
  color: ${props => props.$isCurrentMonth ? '#171717' : '#e5e5e5'};
  background-color: ${props => props.$hasWritten ? '#171717' : 'transparent'};
  color: ${props => props.$hasWritten ? '#ffffff' : (props.$isCurrentMonth ? '#171717' : '#e5e5e5')};
  
  font-weight: ${props => props.$isToday ? '600' : '400'};
  border: ${props => props.$isToday && !props.$hasWritten ? '1px solid #171717' : '1px solid transparent'};

  &:hover {
    background-color: ${props => !props.$hasWritten && props.$isCurrentMonth ? '#f5f5f5' : ''};
  }
`;

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  color: #a3a3a3;
`;

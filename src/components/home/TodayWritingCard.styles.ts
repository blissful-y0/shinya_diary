import styled from "styled-components";
import Link from "next/link";

export const Card = styled.div`
  width: 100%;
  background-color: #171717;
  color: #ffffff;
  border-radius: 4px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  }
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  font-weight: 300;
  line-height: 1.5;
`;

export const StyledLink = styled(Link)`
  background-color: #ffffff;
  color: #171717;
  padding: 12px 32px;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    background-color: #fafafa;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const CompletedBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px;
`;

export const CheckIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  margin-bottom: 8px;
`;

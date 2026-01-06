import styled from "styled-components";
import { Button } from "@/components/ui/button";

export const CoverImageContainer = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%);
  }
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Optional: grayscale filter for cover images */
  /* filter: grayscale(100%); */
`;

export const DashboardSection = styled.section`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fafafa;
`;

export const Container = styled.div`
  padding: 0 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #ffffff;
  min-height: 100vh;
`;

export const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #171717;
  transition: all 0.2s;
  background-color: transparent;

  &:hover {
    background-color: #f5f5f5;
    transform: rotate(15deg);
  }
`;

export const WriteStatusCard = styled.div`
  background-color: #171717;
  border-radius: 4px;
  padding: 28px 24px;
  text-align: center;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  position: relative;
  z-index: 10;
`;

export const WriteStatusText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 0.02em;
  font-family: var(--font-sans);
`;

export const WriteButton = styled(Button)`
  background-color: #ffffff;
  color: #171717;
  font-weight: 600;
  height: 44px;
  padding: 0 28px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fafafa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px 0;
  color: #a3a3a3;
`;

export const FeedSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 12px;
`;

export const LockedFeed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background-color: #fafafa;
  border: 1px dashed #d4d4d4;
  border-radius: 4px;
`;

export const LockedIcon = styled.div`
  color: #a3a3a3;
  margin-bottom: 16px;
  opacity: 0.8;
`;

export const LockedText = styled.p`
  font-size: 14px;
  color: #737373;
  font-weight: 300;
  letter-spacing: 0.02em;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: #a3a3a3;
  font-style: italic;
  font-family: var(--font-sans);
`;

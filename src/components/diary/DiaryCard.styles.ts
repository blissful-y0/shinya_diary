import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const menuSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const CardContainer = styled.article`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  transition: box-shadow 0.3s ease;
  margin-bottom: 24px;
  position: relative;
  
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.02);

  &:hover {
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.04);
  }

  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #f0f0f0;
    z-index: 1;
    pointer-events: none;
  }
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 24px 16px 40px;
  border-bottom: 1px solid transparent;
  position: relative;
  z-index: 2;
`;

export const AuthorInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AuthorName = styled.span`
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: 0.02em;
`;

export const PostTime = styled.span`
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
  color: #a3a3a3;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

export const MenuWrapper = styled.div`
  position: relative;
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #a3a3a3;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--foreground);
    background-color: #f5f5f5;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 1001;
  min-width: 140px;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: ${menuSlide} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--foreground);
  letter-spacing: 0.01em;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #f9f9f9;
  }

  svg {
    opacity: 0.5;
    width: 14px;
    height: 14px;
  }
`;

export const MenuItemDanger = styled(MenuItem)`
  color: #737373;

  &:hover {
    color: #171717;
    background-color: #fff1f2;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  max-height: 520px;
  background-color: #fafafa;
  overflow: hidden;
  cursor: pointer;
  margin: 8px 0 24px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  position: relative;
  z-index: 2;
  
  padding: 0; 
  
  &:active {
    opacity: 0.98;
  }
`;

export const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  display: block;
`;

export const ContentText = styled.p`
  padding: 0 32px 32px 40px;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.85;
  letter-spacing: 0.01em;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
  z-index: 2;

  font-feature-settings: "kern" 1, "liga" 1;
`;

export const CommentToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px 16px 40px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: #737373;
  border-top: 1px solid #f5f5f5;
  transition: all 0.2s ease;
  width: 100%;
  letter-spacing: 0.03em;
  position: relative;
  z-index: 2;

  &:hover {
    color: var(--foreground);
    background-color: #fafafa;
  }

  svg {
    opacity: 0.6;
    width: 16px;
    height: 16px;
  }

  span {
    font-weight: 500;
    color: var(--foreground);
  }
`;

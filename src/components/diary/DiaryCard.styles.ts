import styled from "styled-components";

export const CardContainer = styled.article`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  margin: 0 16px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

export const AuthorInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const AuthorName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #171717;
`;

export const PostTime = styled.span`
  font-size: 12px;
  color: #737373;
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
    color: #171717;
    background-color: #f5f5f5;
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
  min-width: 120px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #171717;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

export const MenuItemDanger = styled(MenuItem)`
  color: #ef4444;

  &:hover {
    background-color: #fef2f2;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  cursor: pointer;
  
  &:active {
    opacity: 0.95;
  }
`;

export const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: cover;
  display: block;
`;

export const ContentText = styled.p`
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
`;

export const CommentToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #525252;
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const CommentCount = styled.span`
  font-weight: 600;
  color: #171717;
`;

export const CommentSectionWrapper = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  border-top: 1px solid #f0f0f0;
`;

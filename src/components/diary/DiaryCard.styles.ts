import styled from "styled-components";

export const CardContainer = styled.article`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: visible; /* Changed to visible to ensure dropdowns aren't clipped */
  margin: 0 0 24px 0;
  border: 1px solid #dbdbdb;
  
  @media (max-width: 640px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
  }
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  position: relative;
  z-index: 10; /* Ensures menu appears above image */
  background-color: #ffffff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const AuthorInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  line-height: 18px;
`;

export const PostTime = styled.span`
  font-size: 12px;
  color: #8e8e8e;
  line-height: 16px;
`;

export const MenuWrapper = styled.div`
  position: relative;
  margin-left: auto;
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #262626;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.6;
  }
`;

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  cursor: default;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: -8px;
  z-index: 9999;
  width: 140px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  overflow: hidden;
  padding: 4px 0;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #262626;
  text-align: left;
  transition: background-color 0.1s ease;
  
  &:hover {
    background-color: #fafafa;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const MenuItemDanger = styled(MenuItem)`
  color: #ed4956;
  font-weight: 600;
  border-top: 1px solid #efefef;
`;

export const ImageContainer = styled.div`
  width: 100%;
  background-color: #efefef;
  cursor: pointer;
  position: relative;
  z-index: 1;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    opacity: 0.98;
  }
`;

export const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: cover;
  display: block;
`;

export const ContentText = styled.p`
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-top: 4px;
`;

export const CommentToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #262626;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 1.5px;
  }
`;

export const CommentCount = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

export const CommentSectionWrapper = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  border-top: 1px solid #efefef;
  padding-top: 8px;
`;

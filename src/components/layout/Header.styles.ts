import styled from "styled-components";
import Link from "next/link";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 56px;
  background: #ffffff;
  /* border-bottom: 1px solid #e5e5e5; */
  z-index: 100;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 48px;
`;

export const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 48px;
`;

export const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #171717;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const Title = styled.h1`
  display: none;
`;

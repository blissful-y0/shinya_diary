import styled from "styled-components";
import Link from "next/link";

export const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 100;
`;

export const NavContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  padding: 0 16px;
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 100%;
  color: ${({ $active }) => ($active ? "#000000" : "#d4d4d4")};
  text-decoration: none;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.96);
  }

  /* Active dot indicator */
  &::after {
    content: "";
    position: absolute;
    bottom: 6px;
    width: 4px;
    height: 4px;
    background-color: #000000;
    border-radius: 50%;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  ${NavItem}:active & {
    transform: scale(0.9);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2px;
  }
`;

export const NavLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

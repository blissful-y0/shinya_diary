import styled from "styled-components";
import Link from "next/link";

export const CardLink = styled(Link)`
  display: block;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px; /* Sharper corners */
  overflow: hidden;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    border-color: #171717;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.99);
    box-shadow: none;
  }
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 72px;
  object-fit: cover;

  transition: filter 0.3s ease;
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;

export const GroupIcon = styled.div<{ $hasImage?: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $hasImage }) =>
    $hasImage ? "transparent" : "#f5f5f5"};
  border: ${({ $hasImage }) => ($hasImage ? "none" : "1px solid #e5e5e5")};
  border-radius: 4px;
  color: #a3a3a3;
  overflow: hidden;
  flex-shrink: 0;

  ${CardLink}:hover & {
    border-color: #171717;
    color: #171717;
  }
`;

export const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const GroupInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const GroupNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GroupName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #171717;
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-sans);
`;

export const OwnerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #737373;
  background: #f5f5f5;
  border-radius: 2px;

  svg {
    opacity: 0.7;
    width: 10px;
    height: 10px;
    margin-right: 2px;
  }
`;

export const MemberCount = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #737373;
  letter-spacing: 0.02em;
  font-family: var(--font-sans);
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #d4d4d4;
  flex-shrink: 0;
  transition: color 0.2s ease;

  ${CardLink}:hover & {
    color: #171717;
  }

  svg {
    transition: transform 0.2s ease;
  }

  ${CardLink}:hover & svg {
    transform: translateX(4px);
  }
`;

export const PendingDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #171717;
  border-radius: 50%;
`;

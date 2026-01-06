import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: #ffffff;
`;

export const TabsContainer = styled.div`
  padding: 16px;
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 24px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const IconSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const CoverImageSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CoverImagePreview = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 4px;
  background-color: #fafafa;
  border: 1px dashed #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CoverImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #a3a3a3;
  font-size: 13px;
`;

export const ImageHint = styled.p`
  font-size: 10px;
  color: #a3a3a3;
  text-align: center;
  margin-top: 8px;
`;

export const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  color: #171717;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  font-family: var(--font-sans);
`;

export const MemberCount = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #a3a3a3;
  font-family: var(--font-sans);
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #404040;
`;

export const IconPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover > div:last-of-type {
    opacity: 1;
  }
`;

export const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const IconPlaceholder = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #d4d4d4;
`;

export const IconOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const NameInput = styled(Input)`
  height: 48px;
  font-size: 16px;
  border-radius: 4px;
  border-color: #e5e5e5;

  &:focus {
    border-color: #171717;
  }
`;

export const SaveButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #171717;
  color: #ffffff;
  border-radius: 4px;

  &:hover {
    background: #000000;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 16px 0;
`;

export const InviteCodeCard = styled.div`
  background-color: #fafafa;
  border: 1px dashed #d4d4d4;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InviteCodeText = styled.span`
  font-size: 18px;
  font-weight: 500;
  font-family: monospace;
  letter-spacing: 2px;
  color: #171717;
`;

export const CopyButton = styled(Button)`
  gap: 8px;
  height: 36px;
  font-size: 13px;
  background: white;
  color: #171717;
  border: 1px solid #e5e5e5;

  &:hover {
    background: #fafafa;
    border-color: #d4d4d4;
  }
`;

export const JoinRequestSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const JoinRequestHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RequestCount = styled.span`
  background-color: #171717;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
`;

export const EmptyRequests = styled.p`
  font-size: 14px;
  color: #a3a3a3;
  text-align: center;
  padding: 32px;
  background-color: #fafafa;
  border-radius: 4px;
  font-style: italic;
`;

export const DangerZone = styled.div`
  background-color: #ffffff;
  border: 1px solid #ef4444;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

export const DangerTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
`;

export const DangerDescription = styled.p`
  font-size: 13px;
  color: #737373;
  line-height: 1.5;
`;

export const DeleteButton = styled(Button)`
  gap: 8px;
  height: 44px;
  font-weight: 500;
  background-color: #ffffff;
  color: #ef4444;
  border: 1px solid #ef4444;

  &:hover {
    background-color: #fef2f2;
    color: #dc2626;
  }
`;

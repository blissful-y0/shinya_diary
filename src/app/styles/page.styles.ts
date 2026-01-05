import styled, { keyframes } from "styled-components";

/* =============================================
   홈 페이지 스타일
   ============================================= */

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const drawLine = keyframes`
  from {
    width: 0;
  }
  to {
    width: 40px;
  }
`;

export const Container = styled.div`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  animation: ${fadeIn} 0.8s ease-out;
`;

/* =============================================
   날짜 표시 영역
   ============================================= */

export const DateSection = styled.section`
  text-align: left;
  padding: 12px 0;
  animation: ${floatUp} 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  position: relative;
`;

export const DateDisplay = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: var(--foreground);
  letter-spacing: -1px;
  line-height: 1.1;
  margin-bottom: 8px;
  font-family: var(--font-sans);
`;

export const DayOfWeek = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  letter-spacing: 2px;
  text-transform: uppercase;
  
  &::after {
    content: "";
    display: block;
    height: 1px;
    background: var(--foreground);
    animation: ${drawLine} 0.8s ease-out 0.4s both;
  }
`;

/* =============================================
   섹션 스타일
   ============================================= */

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${floatUp} 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  animation-fill-mode: both;
  
  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.5px;
  font-style: italic;
`;

export const SectionLink = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--foreground);
    transform: translateX(-2px);
  }
`;

/* =============================================
   피드 카드 스타일
   ============================================= */

export const FeedCard = styled.article`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    border-color: var(--foreground);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const FeedCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
`;

export const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  border: 1px solid var(--border);
`;

export const FeedCardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FeedCardAuthor = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
`;

export const FeedCardTime = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 400;
`;

export const FeedCardContent = styled.p`
  font-size: 15px;
  color: var(--foreground);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 300;
`;

export const FeedCardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
`;

export const FeedCardStat = styled.span`
  font-size: 13px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  
  &:hover {
    color: var(--foreground);
  }
`;

/* =============================================
   핫 트렌드 카드 (가로 스크롤)
   ============================================= */

export const HotScrollContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 24px;
  margin: 0 -24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-padding-left: 24px;
  scroll-padding-right: 24px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HotCard = styled.article`
  flex-shrink: 0;
  width: 160px;
  height: 180px;
  background: var(--foreground);
  border-radius: 24px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  position: relative;
  isolation: isolate;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 100%);
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-6px) rotate(-1deg);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: scale(0.96);
  }
`;

export const HotCardRank = styled.span`
  font-size: 32px;
  font-weight: 800;
  color: var(--background);
  opacity: 0.3;
  position: absolute;
  top: 16px;
  right: 20px;
  font-style: italic;
`;

export const HotCardTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--background);
  line-height: 1.35;
  margin-top: 40px;
  word-break: keep-all;
`;

export const HotCardCount = styled.div`
  display: inline-flex;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  font-size: 11px;
  color: var(--background);
  backdrop-filter: blur(4px);
  width: fit-content;
  font-weight: 500;
`;

/* =============================================
   플레이스홀더 (기존 호환)
   ============================================= */

export const PlaceholderCard = styled.div`
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
`;

export const PlaceholderText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.7;
`;

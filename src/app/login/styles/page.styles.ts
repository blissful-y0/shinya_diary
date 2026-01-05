import styled, { keyframes } from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   로그인 페이지 스타일
   - 타겟: 1020 여성
   - 컨셉: 미니멀 화이트/블랙 모노톤 + 세련된 타이포그래피
   ============================================= */

/* 부드러운 떠오르는 애니메이션 */
const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* 페이드인 애니메이션 */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/* 로고 숨쉬기 효과 - 섬세하게 */
const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

/* 라인 드로잉 애니메이션 */
const drawLine = keyframes`
  from {
    width: 0;
  }
  to {
    width: 40px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  padding: env(safe-area-inset-top, 0px) 0 0 0;
`;

export const BrandingSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px 32px 48px;
  max-width: 400px;
  width: 100%;
  animation: ${floatUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  z-index: 1;
`;

export const Logo = styled.div`
  width: 88px;
  height: 88px;
  background: #000000;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 300;
  font-style: italic;
  color: #ffffff;
  margin-bottom: 32px;
  position: relative;
  letter-spacing: -2px;
  animation: ${breathe} 4s ease-in-out infinite;
  
  /* 미니멀 그림자 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
`;

export const AppName = styled.h1`
  font-size: 28px;
  font-weight: 300;
  color: #000000;
  margin-bottom: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

export const Tagline = styled.p`
  font-size: 14px;
  color: #666666;
  font-weight: 400;
  letter-spacing: 0.5px;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  position: relative;
  
  /* 데코레이션 라인 */
  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 1px;
    background: #000000;
    margin: 24px auto 0;
    animation: ${drawLine} 0.8s ease-out 0.6s both;
  }
`;

export const LoginSection = styled.section`
  padding: 0 32px calc(48px + env(safe-area-inset-bottom, 0px));
  max-width: 400px;
  width: 100%;
  animation: ${floatUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
  position: relative;
  z-index: 1;
`;

export const Description = styled.p`
  text-align: center;
  font-size: 15px;
  color: #888888;
  line-height: 1.7;
  margin-bottom: 28px;
  font-weight: 400;
  letter-spacing: -0.2px;
`;

export const GoogleButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 14px;
  font-weight: 500;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  letter-spacing: 0.5px;

  &:hover {
    background-color: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const GoogleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 4px;
  padding: 2px;
`;

export const Terms = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 11px;
  color: #aaaaaa;
  line-height: 1.6;
  letter-spacing: 0;
`;

export const TermsLink = styled.a`
  color: #666666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #000000;
  }
`;

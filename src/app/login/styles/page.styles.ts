import styled, { keyframes } from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   로그인 페이지 스타일
   - 타겟: 1020 여성
   - 컨셉: 심플하면서 귀여운 감성
   ============================================= */

/* 부드러운 떠오르는 애니메이션 */
const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* 로고 반짝임 효과 */
const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export const Container = styled.div`
  /* 전체 컨테이너 - 따뜻한 그라데이션 배경 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 28px;
  background: linear-gradient(
    180deg,
    #fffbf5 0%,
    #fff8f0 50%,
    #fff5eb 100%
  );
`;

export const BrandingSection = styled.section`
  /* 브랜딩 영역 - 부드러운 등장 효과 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 40px;
  animation: ${floatUp} 0.8s ease-out;
`;

export const Logo = styled.div`
  /* 로고 - 파스텔 그라데이션과 부드러운 그림자 */
  width: 88px;
  height: 88px;
  background: linear-gradient(
    135deg,
    #e8b4b8 0%,
    #f5d5d8 50%,
    #a8c5d8 100%
  );
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  box-shadow: 
    0 8px 24px rgba(232, 180, 184, 0.35),
    0 2px 8px rgba(168, 197, 216, 0.2);
  position: relative;
  letter-spacing: -1px;
  
  /* 은은한 빛남 효과 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

export const AppName = styled.h1`
  /* 앱 이름 - 세련된 타이포그래피 */
  font-size: 28px;
  font-weight: 700;
  color: #3d3d3d;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
`;

export const Tagline = styled.p`
  /* 태그라인 - 부드러운 색상 */
  font-size: 15px;
  color: #9b9b9b;
  font-weight: 400;
  letter-spacing: -0.2px;
`;

export const LoginSection = styled.section`
  /* 로그인 버튼 영역 */
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  animation: ${floatUp} 0.8s ease-out 0.2s both;
`;

export const Description = styled.p`
  /* 설명 텍스트 - 따뜻한 톤 */
  text-align: center;
  font-size: 15px;
  color: #7a7a7a;
  line-height: 1.7;
  margin-bottom: 28px;
  font-weight: 400;
`;

export const GoogleButton = styled(Button)`
  /* Google 로그인 버튼 - 부드럽고 귀여운 스타일 */
  width: 100%;
  height: 56px;
  font-size: 15px;
  font-weight: 500;
  background-color: #ffffff;
  color: #3d3d3d;
  border: 1.5px solid #f0e8e0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(232, 180, 184, 0.08);
  transition: all 0.25s ease;
  letter-spacing: -0.2px;

  &:hover {
    background-color: #fffaf8;
    border-color: #e8b4b8;
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.06),
      0 8px 24px rgba(232, 180, 184, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 4px 16px rgba(232, 180, 184, 0.08);
  }
`;

export const GoogleIcon = styled.span`
  /* Google 아이콘 래퍼 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Terms = styled.p`
  /* 약관 동의 텍스트 */
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #b0b0b0;
  line-height: 1.6;
  letter-spacing: -0.1px;
`;

export const TermsLink = styled.a`
  /* 약관 링크 - 부드러운 핑크 톤 */
  color: #d4a5a9;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e8b4b8;
    text-decoration: underline;
  }
`;

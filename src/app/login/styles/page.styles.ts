import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   로그인 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 전체 컨테이너 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 24px;
  background-color: var(--background);
`;

export const BrandingSection = styled.section`
  /* 브랜딩 영역 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 60px;
`;

export const Logo = styled.div`
  /* 로고 */
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #7C9EB2 0%, #A8C5D8 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
`;

export const AppName = styled.h1`
  /* 앱 이름 */
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 8px;
`;

export const Tagline = styled.p`
  /* 태그라인 */
  font-size: 16px;
  color: var(--muted-foreground);
`;

export const LoginSection = styled.section`
  /* 로그인 버튼 영역 */
  padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));
`;

export const Description = styled.p`
  /* 설명 텍스트 */
  text-align: center;
  font-size: 15px;
  color: var(--muted-foreground);
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const GoogleButton = styled(Button)`
  /* Google 로그인 버튼 */
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 500;
  background-color: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    background-color: var(--accent);
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
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.5;
`;

export const TermsLink = styled.a`
  /* 약관 링크 */
  color: var(--primary);
  text-decoration: underline;
`;

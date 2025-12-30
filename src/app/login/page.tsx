"use client";

import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase/auth";

/* =============================================
   로그인 페이지
   - Google OAuth 로그인
   - 풀스크린 레이아웃 (헤더/네비 없음)
   ============================================= */

export default function LoginPage() {
  /* Google 로그인 핸들러 */
  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error("로그인 실패:", error.message);
    }
  };

  return (
    <Container>
      {/* 로고 & 브랜딩 영역 */}
      <BrandingSection>
        <Logo>S</Logo>
        <AppName>Shinya Diary</AppName>
        <Tagline>소중한 순간을 함께 기록해요</Tagline>
      </BrandingSection>

      {/* 로그인 버튼 영역 */}
      <LoginSection>
        <Description>
          최대 4명의 친구들과
          <br />
          교환일기를 나눠보세요
        </Description>

        <GoogleButton onClick={handleGoogleLogin}>
          <GoogleIcon>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </GoogleIcon>
          Google로 시작하기
        </GoogleButton>

        <Terms>
          계속 진행하면{" "}
          <TermsLink href="/terms">이용약관</TermsLink> 및{" "}
          <TermsLink href="/privacy">개인정보처리방침</TermsLink>에
          동의하는 것으로 간주됩니다.
        </Terms>
      </LoginSection>
    </Container>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
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

const BrandingSection = styled.section`
  /* 브랜딩 영역 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 60px;
`;

const Logo = styled.div`
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

const AppName = styled.h1`
  /* 앱 이름 */
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 8px;
`;

const Tagline = styled.p`
  /* 태그라인 */
  font-size: 16px;
  color: var(--muted-foreground);
`;

const LoginSection = styled.section`
  /* 로그인 버튼 영역 */
  padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));
`;

const Description = styled.p`
  /* 설명 텍스트 */
  text-align: center;
  font-size: 15px;
  color: var(--muted-foreground);
  line-height: 1.6;
  margin-bottom: 24px;
`;

const GoogleButton = styled(Button)`
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

const GoogleIcon = styled.span`
  /* Google 아이콘 래퍼 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Terms = styled.p`
  /* 약관 동의 텍스트 */
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.5;
`;

const TermsLink = styled.a`
  /* 약관 링크 */
  color: var(--primary);
  text-decoration: underline;
`;

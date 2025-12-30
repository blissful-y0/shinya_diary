"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/* =============================================
   Styled Components 레지스트리
   - Next.js App Router에서 SSR 지원
   - 스타일 깜빡임(FOUC) 방지
   ============================================= */

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  /* 스타일시트 인스턴스 생성 (최초 1회) */
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  /* 서버 렌더링 시 스타일 주입 */
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  /* 클라이언트에서는 children만 반환 */
  if (typeof window !== "undefined") return <>{children}</>;

  /* 서버에서는 StyleSheetManager로 감싸서 반환 */
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}

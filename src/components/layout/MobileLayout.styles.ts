import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  background-color: var(--color-background);
  position: relative;

  @media (min-width: 481px) {
    box-shadow: 0 0 50px rgba(139, 115, 85, 0.15);
    border-left: 1px solid rgba(139, 115, 85, 0.05);
    border-right: 1px solid rgba(139, 115, 85, 0.05);
  }
`;

export const Main = styled.main<{ $hasHeader: boolean; $hasNav: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  padding-top: ${({ $hasHeader }) => ($hasHeader ? "56px" : "0")};
  padding-bottom: ${({ $hasNav }) =>
    $hasNav ? "calc(64px + env(safe-area-inset-bottom, 0px))" : "0"};
`;

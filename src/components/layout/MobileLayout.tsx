"use client";

import { ReactNode } from "react";
import styles from "./MobileLayout.module.css";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  headerTitle?: string;
  headerBackHref?: string;
  headerRight?: ReactNode;
}

export default function MobileLayout({
  children,
  showHeader = true,
  showNav = true,
  headerTitle,
  headerBackHref,
  headerRight,
}: MobileLayoutProps) {
  const mainClassName = [
    styles.main,
    showHeader && styles.mainWithHeader,
    !showNav && styles.mainNoNav,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      {showHeader && (
        <Header
          title={headerTitle}
          backHref={headerBackHref}
          right={headerRight}
        />
      )}
      <main className={mainClassName}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}

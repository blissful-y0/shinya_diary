/* =============================================
   날짜 관련 유틸리티 함수
   ============================================= */

/**
 * 날짜를 한국어 형식으로 포맷
 * @example "2024년 1월 15일 (월)"
 */
export function formatDateKorean(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * 상대적 시간 표시 (몇 분 전, 몇 시간 전 등)
 */
export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  /* 일주일 이상이면 날짜 표시 */
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 한국 시간대 기준 오늘 날짜 반환
 */
export function getTodayKST(): Date {
  const now = new Date();
  /* KST는 UTC+9 */
  const kstOffset = 9 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + kstOffset);
}

/**
 * Date를 한국 시간대 기준 ISO 날짜 문자열로 변환
 */
export function toKSTDateString(date: Date): string {
  const kstOffset = 9 * 60 * 60 * 1000;
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const kstDate = new Date(utc + kstOffset);
  return formatDateISO(kstDate);
}

# 홈화면 개선 제안서

## 교환일기 앱 UX 개선: 개인 중심 대시보드

---

## 📋 제안 배경

### 현재 문제점

- 홈화면 진입 시 타인의 일기가 먼저 노출되어 프라이버시 침해 우려
- 자신의 작성 현황 파악이 어려움
- 작성 동기부여 부족
- 그룹 활동 현황을 한눈에 파악하기 어려움

### 개선 목표

- **개인 중심**: 내 기록과 통계를 먼저 보여줌
- **동기부여**: 작성 습관 형성을 돕는 시각적 피드백
- **프라이버시**: 타인의 일기 내용은 의도적으로 접근해야 볼 수 있음
- **참여 유도**: 그룹 전체 활동을 격려하는 UI

---

## 🎯 핵심 기능

### 1. 나의 기록 대시보드

사용자의 작성 활동을 한눈에 보여주는 통계 카드

#### 표시 항목

```
┌─────────────────────────────────┐
│  📊 나의 기록                   │
├─────────────────────────────────┤
│                                 │
│  🔥 연속 작성: 12일             │
│  ━━━━━━━━━━ 100%                │
│                                 │
│  📅 이번 주: 5/7일 작성         │
│  ━━━━━━━━░░ 71%                 │
│                                 │
│  📆 이번 달: 18/30일 작성       │
│  ━━━━━━░░░░ 60%                 │
│                                 │
│  💬 받은 댓글: 23개             │
│                                 │
└─────────────────────────────────┘
```

#### 기능 상세

- **연속 작성 (Streak)**: 하루도 빠짐없이 작성한 날짜 수
  - 시각적 강조 (불 이모지 🔥)
  - 기록 갱신 시 축하 애니메이션

- **주간 작성률**: 이번 주(월~일) 작성 현황
  - 프로그레스 바로 시각화
  - 퍼센티지 표시

- **월간 작성률**: 이번 달 전체 작성 현황
  - 목표 달성도 표시

- **받은 댓글 수**: 최근 30일간 받은 댓글 수
  - 소통 활성도 지표

---

### 2. 캘린더 히트맵

GitHub 스타일의 작성 현황 시각화

#### 화면 설계

```
┌─────────────────────────────────────────────────┐
│  📅 작성 캘린더                    2024년 12월  │
├─────────────────────────────────────────────────┤
│                                                 │
│      월  화  수  목  금  토  일                 │
│                      1   2   3                 │
│  W1  ✅  ✅  ⬜  ✅  ✅  ⬜  ✅                 │
│  W2  ✅  ✅  ✅  ✅  ⬜  ✅  ✅                 │
│  W3  ✅  ⬜  ✅  ✅  ✅  ⬜  ✅                 │
│  W4  ✅  ✅  ✅  ✅  ✅  ⬜  ⬜                 │
│                                                 │
│  ✅ 작성함  ⬜ 작성 안 함  📝 오늘             │
│                                                 │
│  [< 이전 달]              [다음 달 >]           │
└─────────────────────────────────────────────────┘
```

#### 인터랙션

- **날짜 클릭**: 해당 날짜의 일기 보기
- **호버 툴팁**: 날짜 + 작성 여부 상세 정보
- **월 전환**: 이전/다음 달 탐색
- **색상 구분**:
  - ✅ 녹색: 작성 완료
  - ⬜ 회색: 작성 안 함
  - 📝 파란색: 오늘 (작성 전)
  - 🟢 진한 녹색: 오늘 (작성 완료)

  필요하다면 테마에 맞추어 색상 변경 가능

---

## 🎨 새로운 홈화면 레이아웃

```
┌───────────────────────────────────────────┐
│  [그룹명: 우리의 하루]        [설정 ⚙️]   │
├───────────────────────────────────────────┤
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  📝 오늘의 일기              [날짜] │ │
│  ├─────────────────────────────────────┤ │
│  │                                     │ │
│  │  [작성 전]                          │ │
│  │  ✍️ 오늘의 일기 쓰기                │ │
│  │  (큰 버튼)                          │ │
│  │                                     │ │
│  │  또는                                │ │
│  │                                     │ │
│  │  [작성 후]                          │ │
│  │  ✅ 작성 완료!                      │ │
│  │  🔓 오늘의 피드 보기                │ │
│  │  (또는 잠금 상태 표시)              │ │
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  📊 나의 기록                       │ │
│  ├─────────────────────────────────────┤ │
│  │  🔥 연속 작성: 12일                 │ │
│  │  📅 이번 주: 5/7일 (71%)            │ │
│  │  📆 이번 달: 18/30일 (60%)          │ │
│  │  💬 받은 댓글: 23개                 │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  📅 작성 캘린더          [12월 ▼]  │ │
│  ├─────────────────────────────────────┤ │
│  │  월 화 수 목 금 토 일               │ │
│  │  ✅ ✅ ⬜ ✅ ✅ ⬜ ✅               │ │
│  │  ...                                │ │
│  │                                     │ │
│  │  [전체 캘린더 보기 >]               │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  👥 그룹 현황                       │ │
│  ├─────────────────────────────────────┤ │
│  │  오늘: 2/4명 작성 완료              │ │
│  │  민수 ✅  지영 ⏰  현아 ✅  철수 ⏰ │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  🔔 최근 활동                       │ │
│  ├─────────────────────────────────────┤ │
│  │  • 민수님이 12/3 일기에 댓글 남김   │ │
│  │  • 지영님이 오늘 일기 작성 완료     │ │
│  │  • 모두 작성 완료! 피드 확인하기    │ │
│  └─────────────────────────────────────┘ │
│                                           │
└───────────────────────────────────────────┘
```

---

## 🔧 기술 구현 방안

### 1. 데이터베이스 변경

필요한 추가 쿼리 (새 테이블 불필요, 기존 데이터 활용)

```sql
-- 1. 연속 작성 일수 계산 (Streak)
WITH RECURSIVE date_series AS (
  -- 오늘부터 과거로 역순 날짜 생성
  SELECT CURRENT_DATE as date
  UNION ALL
  SELECT date - INTERVAL '1 day'
  FROM date_series
  WHERE date > CURRENT_DATE - INTERVAL '365 days'
),
user_diary_dates AS (
  -- 사용자가 작성한 날짜
  SELECT DISTINCT date
  FROM diaries
  WHERE user_id = $1
    AND group_id = $2
    AND deleted_at IS NULL
)
SELECT COUNT(*) as streak
FROM date_series
WHERE date <= CURRENT_DATE
  AND EXISTS (
    SELECT 1 FROM user_diary_dates
    WHERE user_diary_dates.date = date_series.date
  )
  AND NOT EXISTS (
    SELECT 1 FROM date_series ds2
    WHERE ds2.date < date_series.date
      AND ds2.date >= date_series.date - INTERVAL '1 day'
      AND NOT EXISTS (
        SELECT 1 FROM user_diary_dates
        WHERE date = ds2.date
      )
  );

-- 2. 주간/월간 작성 현황
SELECT
  COUNT(*) as written_count,
  -- 이번 주 일수 (월요일부터)
  EXTRACT(DOW FROM CURRENT_DATE) + 1 as week_days,
  -- 이번 달 일수
  EXTRACT(DAY FROM CURRENT_DATE) as month_days
FROM diaries
WHERE user_id = $1
  AND group_id = $2
  AND deleted_at IS NULL
  AND (
    -- 이번 주 (월요일 시작)
    date >= DATE_TRUNC('week', CURRENT_DATE)
    OR
    -- 이번 달
    date >= DATE_TRUNC('month', CURRENT_DATE)
  );

-- 3. 받은 댓글 수 (최근 30일)
SELECT COUNT(*) as comment_count
FROM comments c
JOIN diaries d ON c.diary_id = d.id
WHERE d.user_id = $1
  AND d.group_id = $2
  AND c.deleted_at IS NULL
  AND c.created_at >= CURRENT_DATE - INTERVAL '30 days';

-- 4. 월별 캘린더 데이터
SELECT
  date,
  COUNT(*) as has_written
FROM diaries
WHERE user_id = $1
  AND group_id = $2
  AND deleted_at IS NULL
  AND date >= DATE_TRUNC('month', $3::date)  -- 조회할 월
  AND date < DATE_TRUNC('month', $3::date) + INTERVAL '1 month'
GROUP BY date
ORDER BY date;
```

### 2. API 엔드포인트

#### 새로 추가할 API

```typescript
// GET /api/groups/[publicId]/stats
// 사용자의 통계 데이터 반환
interface StatsResponse {
  streak: number; // 연속 작성 일수
  weekWritten: number; // 이번 주 작성 수
  weekTotal: number; // 이번 주 총 일수
  monthWritten: number; // 이번 달 작성 수
  monthTotal: number; // 이번 달 총 일수
  recentComments: number; // 최근 30일 받은 댓글
}

// GET /api/groups/[publicId]/calendar?year=2024&month=12
// 월별 캘린더 데이터 반환
interface CalendarResponse {
  dates: {
    date: string; // "2024-12-01"
    hasWritten: boolean;
  }[];
  monthInfo: {
    year: number;
    month: number;
    startDay: number; // 0=일요일, 1=월요일, ...
    totalDays: number;
  };
}
```

### 3. 컴포넌트 구조

```
src/
├── app/
│   └── groups/
│       └── [publicId]/
│           └── page.tsx                    # 홈화면 (리디자인)
├── components/
│   ├── home/
│   │   ├── StatsCard.tsx                  # 📊 나의 기록 카드
│   │   ├── CalendarHeatmap.tsx            # 📅 캘린더 히트맵
│   │   ├── TodayWritingCard.tsx           # 📝 오늘의 일기 카드
│   │   ├── GroupStatusCard.tsx            # 👥 그룹 현황 카드
│   │   └── RecentActivityCard.tsx         # 🔔 최근 활동 카드
│   └── ui/
│       ├── ProgressBar.tsx                # 프로그레스 바
│       └── Badge.tsx                      # 배지 컴포넌트
└── lib/
    └── hooks/
        ├── useUserStats.ts                # 통계 데이터 hook
        └── useCalendar.ts                 # 캘린더 데이터 hook
```

### 4. 주요 컴포넌트 구현

#### StatsCard.tsx

```typescript
interface StatsCardProps {
  groupId: string;
}

export default function StatsCard({ groupId }: StatsCardProps) {
  const { stats, isLoading } = useUserStats(groupId);

  return (
    <Card>
      <CardHeader>📊 나의 기록</CardHeader>
      <CardContent>
        {/* 연속 작성 */}
        <StatItem
          icon="🔥"
          label="연속 작성"
          value={`${stats.streak}일`}
          highlight={stats.streak >= 7}
        />

        {/* 주간 작성률 */}
        <StatItem
          icon="📅"
          label="이번 주"
          value={`${stats.weekWritten}/${stats.weekTotal}일`}
          progress={stats.weekWritten / stats.weekTotal}
        />

        {/* 월간 작성률 */}
        <StatItem
          icon="📆"
          label="이번 달"
          value={`${stats.monthWritten}/${stats.monthTotal}일`}
          progress={stats.monthWritten / stats.monthTotal}
        />

        {/* 받은 댓글 */}
        <StatItem
          icon="💬"
          label="받은 댓글"
          value={`${stats.recentComments}개`}
        />
      </CardContent>
    </Card>
  );
}
```

#### CalendarHeatmap.tsx

```typescript
interface CalendarHeatmapProps {
  groupId: string;
  initialYear?: number;
  initialMonth?: number;
}

export default function CalendarHeatmap({
  groupId,
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth() + 1,
}: CalendarHeatmapProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const { calendar, isLoading } = useCalendar(groupId, year, month);

  // 캘린더 그리드 생성
  const weeks = generateCalendarGrid(calendar);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <span>📅 작성 캘린더</span>
          <MonthSelector
            year={year}
            month={month}
            onPrev={() => goToPrevMonth()}
            onNext={() => goToNextMonth()}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['월', '화', '수', '목', '금', '토', '일'].map(day => (
            <div key={day} className="text-center text-sm text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day, idx) => (
            <CalendarDay
              key={idx}
              date={day?.date}
              hasWritten={day?.hasWritten}
              isToday={day?.isToday}
              onClick={() => day && handleDayClick(day.date)}
            />
          ))}
        </div>

        {/* 범례 */}
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <span>✅ 작성함</span>
          <span>⬜ 작성 안 함</span>
          <span>📝 오늘</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📊 예상 효과

### 사용자 행동 변화

1. **작성 습관 형성**: 연속 작성 기록을 지키려는 동기 부여
2. **재방문율 증가**: 자신의 통계를 확인하기 위한 앱 방문 증가
3. **참여도 향상**: 시각적 피드백으로 그룹 활동 독려

### 프라이버시 개선

1. 타인의 일기가 자동으로 노출되지 않음
2. 의도적인 탐색을 통해서만 피드 접근
3. 개인 공간의 느낌 강화

### UX 개선

1. 자신의 기록에 집중하는 경험
2. 성취감을 주는 시각화
3. 명확한 정보 계층 구조

---

## 🚀 구현 단계

### Phase 1: API 개발

1. 통계 API 엔드포인트 구현
2. 캘린더 API 엔드포인트 구현
3. 쿼리 최적화 및 테스트

### Phase 2: 컴포넌트 개발

1. StatsCard 컴포넌트
2. CalendarHeatmap 컴포넌트
3. 공통 UI 컴포넌트 (ProgressBar, Badge 등)

### Phase 3: 홈화면 통합

1. 기존 홈화면 레이아웃 리팩토링
2. 새 컴포넌트 통합
3. 반응형 디자인 적용

### Phase 4: 테스트 & 최적화

1. 성능 최적화 (쿼리, 렌더링)
2. 엣지 케이스 처리
3. 사용자 테스트 및 피드백 수집

---

## 📝 추가 고려사항

### 성능 최적화

- **캐싱 전략**: SWR을 활용한 통계 데이터 캐싱
- **쿼리 최적화**: 인덱스 활용, 불필요한 JOIN 제거
- **지연 로딩**: 캘린더는 필요할 때만 데이터 요청

### 확장 가능성

- **뱃지 시스템**: 연속 7일, 30일, 100일 등 마일스톤 배지
- **목표 설정**: 주간/월간 작성 목표 설정 기능
- **그룹 통계**: 그룹 전체의 작성률, 활동도 순위
- **리마인더**: 작성 안 한 날 푸시 알림

### 접근성

- **색맹 지원**: 색상 외에도 아이콘/패턴으로 구분
- **스크린 리더**: 적절한 ARIA 레이블
- **키보드 내비게이션**: 캘린더 날짜 탐색 지원

---

## 💡 결론

이번 홈화면 개선을 통해:

- ✅ 사용자의 프라이버시를 보호하면서
- ✅ 작성 동기를 부여하고
- ✅ 성취감을 제공하는

**개인 중심의 교환일기 경험**을 제공할 수 있습니다.

통계와 캘린더는 단순한 기록을 넘어, 사용자의 일기 작성 습관을 시각화하고 지속 가능한 참여를 유도하는 핵심 기능이 될 것입니다.

---

**제안일**: 2025-01-06
**작성자**: Claude (AI Assistant)
**문서 버전**: 1.0

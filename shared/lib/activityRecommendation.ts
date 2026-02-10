export interface Activity {
  name: string;
  description: string;
  icon: string;
}

const activities: Record<string, Activity[]> = {
  맑음: [
    { name: "산책", description: "날씨가 좋아 산책하기 좋은 날입니다", icon: "🚶" },
    { name: "운동", description: "야외 운동하기 좋은 날씨입니다", icon: "🏃" },
    { name: "피크닉", description: "공원에서 피크닉을 즐기세요", icon: "🧺" },
    { name: "자전거", description: "자전거 타기 좋은 날입니다", icon: "🚴" },
  ],
  구름많음: [
    { name: "산책", description: "구름이 있어 산책하기 좋습니다", icon: "🚶" },
    { name: "카페", description: "카페에서 여유롭게 시간 보내기", icon: "☕" },
    { name: "쇼핑", description: "실내 쇼핑몰 나들이", icon: "🛍️" },
  ],
  흐림: [
    { name: "영화", description: "실내에서 영화 감상하기", icon: "🎬" },
    { name: "독서", description: "도서관이나 카페에서 독서", icon: "📚" },
    { name: "박물관", description: "박물관 관람하기", icon: "🏛️" },
  ],
  비: [
    { name: "영화", description: "비 오는 날 영화 보기", icon: "🎬" },
    { name: "카페", description: "카페에서 따뜻한 음료 마시기", icon: "☕" },
    { name: "독서", description: "집에서 책 읽기", icon: "📚" },
    { name: "요리", description: "집에서 요리하기", icon: "👨‍🍳" },
  ],
  눈: [
    { name: "눈사람", description: "눈사람 만들기", icon: "⛄" },
    { name: "스키", description: "스키장 나들이", icon: "⛷️" },
    { name: "핫초코", description: "따뜻한 핫초코 마시기", icon: "☕" },
  ],
  천둥번개: [
    { name: "실내 활동", description: "안전을 위해 실내에서 활동하세요", icon: "🏠" },
    { name: "영화", description: "집에서 영화 보기", icon: "🎬" },
  ],
  안개: [
    { name: "실내 활동", description: "시야가 좋지 않아 실내 활동 권장", icon: "🏠" },
    { name: "독서", description: "집에서 책 읽기", icon: "📚" },
  ],
};

export function getRecommendedActivities(description: string): Activity[] {
  const normalized = description.trim();
  
  for (const [key, activityList] of Object.entries(activities)) {
    if (normalized.includes(key)) {
      return activityList;
    }
  }
  
  return activities["맑음"];
}

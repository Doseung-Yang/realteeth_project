"use client";

import { Card } from "@/shared/ui/Card";
import { getRecommendedActivities } from "@/shared/lib/activityRecommendation";

interface ActivityRecommendationProps {
  weatherDescription: string;
}

export const ActivityRecommendation: React.FC<ActivityRecommendationProps> = ({
  weatherDescription,
}) => {
  const activities = getRecommendedActivities(weatherDescription);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        오늘의 추천 활동
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{activity.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {activity.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

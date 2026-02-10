export function getTemperatureColor(temp: number): string {
  if (temp < 0) {
    return "text-blue-600 dark:text-blue-400";
  }
  if (temp < 10) {
    return "text-blue-500 dark:text-blue-400";
  }
  if (temp < 20) {
    return "text-green-600 dark:text-green-400";
  }
  if (temp < 30) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  return "text-red-600 dark:text-red-400";
}

export function getTemperatureBgColor(temp: number): string {
  if (temp < 0) {
    return "bg-blue-50 dark:bg-blue-900/20";
  }
  if (temp < 10) {
    return "bg-blue-50 dark:bg-blue-900/20";
  }
  if (temp < 20) {
    return "bg-green-50 dark:bg-green-900/20";
  }
  if (temp < 30) {
    return "bg-yellow-50 dark:bg-yellow-900/20";
  }
  return "bg-red-50 dark:bg-red-900/20";
}

export function getTemperatureBorderColor(temp: number): string {
  if (temp < 0) {
    return "border-blue-200 dark:border-blue-800";
  }
  if (temp < 10) {
    return "border-blue-200 dark:border-blue-800";
  }
  if (temp < 20) {
    return "border-green-200 dark:border-green-800";
  }
  if (temp < 30) {
    return "border-yellow-200 dark:border-yellow-800";
  }
  return "border-red-200 dark:border-red-800";
}

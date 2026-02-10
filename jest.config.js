const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 next/jest가 로드할 수 있도록 함
  dir: "./",
});

// Jest에 전달할 커스텀 설정 추가
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "shared/**/*.{ts,tsx}",
    "entities/**/*.{ts,tsx}",
    "features/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
};

// createJestConfig는 비동기이므로 next/jest가 로드할 수 있도록 내보냄
module.exports = createJestConfig(customJestConfig);

import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
  ],

  testEnvironment:
    "jest-environment-jsdom",

  moduleNameMapper: {
    "^@/(.*)$":
      "<rootDir>/src/$1",
  },

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
  ],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/layout.tsx",
    "!src/**/loading.tsx",
    "!src/**/error.tsx",
  ],
};

export default createJestConfig(
  config
);
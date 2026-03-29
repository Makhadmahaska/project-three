import  { Config } from "@jest/types";

const config = {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};

export default config;
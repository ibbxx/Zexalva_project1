module.exports = {
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@next/next/no-html-link-for-pages": "off",
    "import/no-default-export": "off",
  },
};

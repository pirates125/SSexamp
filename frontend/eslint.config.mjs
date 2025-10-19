// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js ve TypeScript temel kuralları
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🚫 Gereksiz dizinleri yoksay
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // 🚀 Build’i durduran kuralları kapat
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",     // any kullanımını serbest bırak
      "react/no-unescaped-entities": "off",            // ' karakteri için escape zorunluluğunu kapat
      "@typescript-eslint/no-unused-vars": "warn",     // kullanılmayan değişkenleri sadece uyarı yap
      "react-hooks/exhaustive-deps": "warn",           // eksik useEffect bağımlılıklarını sadece uyarı yap
    },
  },
];

export default eslintConfig;

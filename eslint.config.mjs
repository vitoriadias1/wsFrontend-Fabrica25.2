import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Regras base do Next + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Ignorar pastas/arquivos
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // >>> Desative aqui a regra "no-explicit-any"
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",

      // Se quiser também silenciar o alerta do useEffect:
      // "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;

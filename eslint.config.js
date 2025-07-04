import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
	{
        plugins: {
            react,
            'jsx-a11y': jsxA11y,
            'react-hooks': reactHooks,
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            "prefer-const": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "no-empty": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "jsx-a11y/no-static-element-interactions": "off",
            "jsx-a11y/click-events-have-key-events": "off"
        }
    }
]);
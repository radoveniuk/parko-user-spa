import type { StorybookConfig } from "@storybook/react-vite";
import { defineConfig } from 'vite';
import customViteConfig  from '../vite.config.storybook';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async () => {
    return defineConfig(customViteConfig);
  },
};
export default config;

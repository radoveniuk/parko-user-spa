import type { StorybookConfig } from "@storybook/react-vite";
import omit from "lodash-es/omit";
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-actions",
    'storybook-addon-mock',
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // viteFinal
  viteFinal: (inlineConfig) => {
    return omit(inlineConfig, 'define');
  },
};
export default config;

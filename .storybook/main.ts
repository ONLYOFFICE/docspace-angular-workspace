import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  // Storybook phones home with anonymous usage data by default.
  core: { disableTelemetry: true },
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;

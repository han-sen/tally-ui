import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Tally',
    colorPrimary: '#2f48f4',
    colorSecondary: '#2f48f4',
  }),
});

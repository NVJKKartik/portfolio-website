import { themes } from '@storybook/theming';
import { addons } from '@storybook/addons';

addons.setConfig({
  theme: {
    ...themes.dark,
    // brandImage: 'https://hamishw.com/icon.svg',
    brandTitle: 'NVJK Kartik Components',
    brandUrl: 'https://NVJKKartik.cf',
  },
});

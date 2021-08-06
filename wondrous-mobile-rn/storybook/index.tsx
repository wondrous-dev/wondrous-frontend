// /storybook/index.js
import { getStorybookUI, configure } from '@storybook/react-native'

import './rn-addons'

// import stories
configure(() => {
  require('./stories')
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
  port: 7007,
  host: 'localhost'
});

export default StorybookUIRoot
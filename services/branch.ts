import Constants from 'expo-constants';

if (Constants.appOwnership !== 'standalone') {
  module.exports = {
    subscribe: console.log,
    createBranchUniversalObject: async () => ({
      showShareSheet: console.log,
    })
  }
}
else{
  module.exports = require('expo-branch')
}
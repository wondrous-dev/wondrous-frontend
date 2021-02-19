export default ({ config }) => {
  return {
    ...config,
    extra: {
      httpUri: process.env.REACT_APP_SERVER_URL || 'http://api.wonderapp.co/'
    }
  };
}
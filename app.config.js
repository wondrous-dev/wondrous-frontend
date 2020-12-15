export default ({ config }) => {
  return {
    ...config,
    extra: {
      httpUri: process.env.REACT_APP_SERVER_URL || 'http://localhost:4000/graphql'
    }
  };
}
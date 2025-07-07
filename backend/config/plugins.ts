export default () => ({
  upload: {
    enabled: true,
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10000000,
      },
    },
  },
});

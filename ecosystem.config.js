module.exports = {
  apps: [
    {
      name: 'csa_hackathon_2023_dev',
      script: './dist/main.js',
      ignore_watch: ['node_modules'],
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'dev',
      },
    },
  ],
};

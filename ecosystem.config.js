module.exports = {
  apps: [
    {
      name: 'nature-nas-full',
      port: '3000',
      exec_mode: 'fork',
      script: './.output/server/index.mjs'
    }
  ]
};

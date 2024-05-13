module.exports = {
  apps: [
    {
      name: 'Server',
      script: './AceLoungeBackend/server.js',
      watch: true,
      env: {
        "PORT": 3000, // Assuming you want to use the same DB for both scripts
        "NODE_ENV": "development",
      },
      env_production: {
        "NODE_ENV": "production",
      }
    },
    {
      name: 'DataScraper',
      script: './AceLoungeBackend/datascraper.js',
      watch: true,
      env: {
        "USER_LOGIN": process.env.USER_LOGIN,
        "USER_PASS": process.env.USER_PASS,
        "NODE_ENV": "development",
      },
      env_production: {
        "NODE_ENV": "production",
      }
    }
  ]
};
module.exports = {
    apps : [
      {
        name: 'NextApp',
        script: 'npm',
        args: 'run dev',
        cwd: './app/',
        env: {
          NODE_ENV: 'development',
          PORT: 3000, // Make sure this matches the port your Next.js app runs on
        },
        env_production: {
          NODE_ENV: 'production',
        }
      },
      {
        name: 'ExpressServer',
        script: 'npm',
        args: 'run dev',
        cwd: './server/',
        env: {
          NODE_ENV: 'development',
          PORT: 3001, // Adjust the port according to your Express server configuration
        },
        env_production: {
          NODE_ENV: 'production',
        }
      }
    ]
  };
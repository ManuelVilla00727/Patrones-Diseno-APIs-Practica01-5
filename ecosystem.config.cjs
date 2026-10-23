module.exports = {
  apps: [
    {
      name: 'backend-empleados',
      script: 'src/index.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '3.214.243.100',
      key: 'C:/practica-mean/practica7-key.pem',
      ref: 'origin/main',
      repo: 'https://github.com/ManuelVilla00727/Patrones-Diseno-APIs-Practica01-5.git',
      path: '/home/ubuntu/Patrones-Diseno-APIs-Practica01-5',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.cjs'
    }
  }
};
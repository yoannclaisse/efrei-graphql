const sonarqubeScanner = require('sonarqube-scanner').default;

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.sources': 'src',
      'sonar.tests': 'test',
      'sonar.inclusions': 'src/**/*.ts', // Entry point of your code
      'sonar.test.inclusions':
        'test/**/*.spec.ts,test/**/*.e2e-spec.ts,test/**/*.spec.jsx,test/**/*.test.js,test/**/*.test.jsx',
      'sonar.login': 'sqa_9d4a99c7afee726dc767ec9cb945d67b0b43c8cb',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    },
  },
  () => {
    console.log('Error Occurred while scanning');
  },
);

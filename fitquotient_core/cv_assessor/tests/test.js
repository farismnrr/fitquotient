const { runCLI } = require('jest');
const path = require('path');

async function runE2ETests() {
  console.log('\n========================================');
  console.log('Starting E2E Testing Suite...');
  console.log('========================================');

  // Print global configuration
  const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
  const API_KEY = process.env.API_KEY || 'test-api-key';

  console.log('\nGlobal Test Configuration:');
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  API Key: ${API_KEY}`);
  console.log('========================================\n');

  const options = {
    projects: [path.resolve(__dirname)],
  };

  try {
    const { results } = await runCLI(options, [__dirname]);

    console.log('\n========================================');
    console.log('E2E Testing completed.');
    console.log('========================================');

    if (results.numFailedTests > 0) {
      console.log('Failed test details:');
      results.testResults.forEach(testResult => {
        testResult.testResults.forEach(assertion => {
          if (assertion.status === 'failed') {
            console.log(`Test: ${assertion.title}`);
            console.log(`Failures: ${assertion.failureMessages.join('\n')}`);
            console.log('---');
          }
        });
      });
      console.log(`❌ Failed tests: ${results.numFailedTests}`);
      console.log(`✅ Passed tests: ${results.numPassedTests}`);
      process.exit(1);
    } else {
      console.log(`✅ All tests passed! Total: ${results.numPassedTests}`);
    }
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  (async () => {
    await runE2ETests();
  })();
}
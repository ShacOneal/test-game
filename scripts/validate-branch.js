const { execSync } = require('child_process');

const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

if (branchName === 'main' || branchName === 'master') {
  process.exit(0);
}

const validPattern =
  /^(feat|fix|chore|docs|style|refactor|perf|test|ci|build|revert)\/[a-z0-9._-]+$/;

if (!validPattern.test(branchName)) {
  console.error('\n❌ ERROR: Invalid branch name!');
  console.error(`Your branch: "${branchName}"`);
  console.error('Branches must start with: feat/, fix/, chore/, docs/, etc.');
  console.error('Example: feat/add-ludo-board\n');
  process.exit(1);
}

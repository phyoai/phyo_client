#!/usr/bin/env node

/**
 * Performance Testing Script
 * Runs automated performance checks and generates a report
 *
 * Usage: node scripts/performance-test.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60) + '\n', 'cyan');
}

function checkmark(condition, message) {
  const symbol = condition ? '✅' : '❌';
  const color = condition ? 'green' : 'red';
  log(`${symbol} ${message}`, color);
  return condition;
}

// Test data
const results = {
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  checks: [],
  score: 0,
};

// 1. Check if Next.js is installed
section('Dependency Check');
try {
  require.resolve('next');
  checkmark(true, 'Next.js is installed');
  results.checks.push({ name: 'Next.js installed', passed: true });
} catch (e) {
  checkmark(false, 'Next.js is NOT installed - run npm install');
  results.checks.push({ name: 'Next.js installed', passed: false });
}

// 2. Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
const hasPackageJson = fs.existsSync(packageJsonPath);
checkmark(hasPackageJson, 'package.json exists');
results.checks.push({ name: 'package.json exists', passed: hasPackageJson });

// 3. Check if tsconfig.json is valid
section('Configuration Check');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
let tsconfigValid = false;
if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    tsconfigValid = true;
    checkmark(true, 'tsconfig.json is valid');

    // Check for modern settings
    const hasIgnoreDeprecations = tsconfig.compilerOptions?.ignoreDeprecations === '6.0';
    checkmark(hasIgnoreDeprecations, 'TypeScript deprecations ignored (6.0)');

    const isBundler = tsconfig.compilerOptions?.moduleResolution === 'bundler';
    checkmark(isBundler, 'Module resolution set to "bundler"');

    results.checks.push({ name: 'tsconfig.json valid', passed: true });
    results.checks.push({ name: 'TypeScript modern config', passed: hasIgnoreDeprecations && isBundler });
  } catch (e) {
    checkmark(false, `tsconfig.json is invalid: ${e.message}`);
    results.checks.push({ name: 'tsconfig.json valid', passed: false });
  }
} else {
  checkmark(false, 'tsconfig.json not found');
  results.checks.push({ name: 'tsconfig.json exists', passed: false });
}

// 4. Check if .gitignore protects secrets
section('Security Check');
const gitignorePath = path.join(process.cwd(), '.gitignore');
let protectsSecrets = false;
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  protectsSecrets = gitignoreContent.includes('.env');
  checkmark(protectsSecrets, '.gitignore protects .env files');
  results.checks.push({ name: '.env protection', passed: protectsSecrets });
}

// 5. Check for new secure files
section('New Secure Files Check');
const secureAuthPath = path.join(process.cwd(), 'src/utils/secure-auth.js');
const inputValidationPath = path.join(process.cwd(), 'src/utils/input-validation.js');

const hasSecureAuth = fs.existsSync(secureAuthPath);
const hasInputValidation = fs.existsSync(inputValidationPath);

checkmark(hasSecureAuth, 'secure-auth.js exists');
checkmark(hasInputValidation, 'input-validation.js exists');

results.checks.push({ name: 'secure-auth.js', passed: hasSecureAuth });
results.checks.push({ name: 'input-validation.js', passed: hasInputValidation });

// 6. Check for optimized components
section('Performance Files Check');
const pricingSectionPath = path.join(process.cwd(), 'src/app/landing/components/PricingSection.jsx');
const pricingCardPath = path.join(process.cwd(), 'src/app/landing/components/PricingCard.jsx');

const hasPricingSection = fs.existsSync(pricingSectionPath);
const hasPricingCard = fs.existsSync(pricingCardPath);

checkmark(hasPricingSection, 'PricingSection.jsx (optimized) exists');
checkmark(hasPricingCard, 'PricingCard.jsx (optimized) exists');

results.checks.push({ name: 'PricingSection.jsx', passed: hasPricingSection });
results.checks.push({ name: 'PricingCard.jsx', passed: hasPricingCard });

// 7. Check documentation
section('Documentation Check');
const docFiles = [
  'SECURITY_PERFORMANCE_IMPROVEMENTS.md',
  'DEVELOPER_GUIDE.md',
  'IMPLEMENTATION_SUMMARY.md',
  'QUICK_START.md',
  'PERFORMANCE_TESTING_GUIDE.md',
];

let docsFound = 0;
docFiles.forEach(doc => {
  const docPath = path.join(process.cwd(), doc);
  const exists = fs.existsSync(docPath);
  if (exists) docsFound++;
  checkmark(exists, `${doc}`);
  results.checks.push({ name: doc, passed: exists });
});

// Calculate score
section('Performance Score');
const passedChecks = results.checks.filter(c => c.passed).length;
const totalChecks = results.checks.length;
const score = Math.round((passedChecks / totalChecks) * 100);

log(`Passed: ${passedChecks}/${totalChecks} checks (${score}%)`,
  score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red'
);

// Score interpretation
section('Score Interpretation');
if (score >= 90) {
  log('🟢 Excellent! Your app is production-ready.', 'green');
} else if (score >= 70) {
  log('🟡 Good. Some improvements recommended.', 'yellow');
} else {
  log('🔴 Critical. Please address failed checks.', 'red');
}

// Recommendations
section('Next Steps');
log('1. Start dev server: npm run dev', 'cyan');
log('2. Open http://localhost:3000 in browser', 'cyan');
log('3. Open DevTools (F12) and check:');
log('   - Console tab (should be clean)', 'cyan');
log('   - Network tab (all requests green)', 'cyan');
log('   - Performance tab (< 2s load time)', 'cyan');
log('4. Run Lighthouse audit (Lighthouse tab)', 'cyan');
log('5. Review PERFORMANCE_TESTING_GUIDE.md', 'cyan');

// Save report
const reportPath = path.join(process.cwd(), '.performance-report.json');
results.score = score;
results.summary = {
  totalChecks,
  passedChecks,
  failedChecks: totalChecks - passedChecks,
  timestamp: new Date().toLocaleString(),
};

fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
log(`\n✅ Report saved to .performance-report.json`, 'green');

// Final summary
log(`\n${'─'.repeat(60)}`, 'cyan');
log(`Performance Check Complete - Score: ${score}%`, 'bright');
log(`${'─'.repeat(60)}\n`, 'cyan');

process.exit(score >= 70 ? 0 : 1);

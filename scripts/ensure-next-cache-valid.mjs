import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const nextCacheDir = path.join(projectRoot, '.next');
const stateFile = path.join(projectRoot, '.next-cache-state.json');

const trackedFiles = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
  'tailwind.config.js',
  'tailwind.config.cjs',
  'tailwind.config.mjs',
];

const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const trackedPackages = [
  ...new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]),
].sort();

const hash = createHash('sha256');

for (const relativePath of trackedFiles) {
  const absolutePath = path.join(projectRoot, relativePath);

  if (!existsSync(absolutePath)) {
    continue;
  }

  hash.update(`file:${relativePath}\n`);
  hash.update(readFileSync(absolutePath));
  hash.update('\n');
}

for (const packageName of trackedPackages) {
  const packageJsonPath = path.join(projectRoot, 'node_modules', packageName, 'package.json');

  if (!existsSync(packageJsonPath)) {
    continue;
  }

  const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  hash.update(`package:${packageName}@${version}\n`);
}

const currentFingerprint = hash.digest('hex');
const previousFingerprint = existsSync(stateFile) ? readFileSync(stateFile, 'utf8').trim() : '';
const shouldClearCache =
  existsSync(nextCacheDir) &&
  (!previousFingerprint || previousFingerprint !== currentFingerprint);

if (shouldClearCache) {
  rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('Cleared .next because the dependency or Tailwind/PostCSS fingerprint changed.');
}

writeFileSync(stateFile, `${currentFingerprint}\n`, 'utf8');

import { getInput, setFailed, setOutput } from '@actions/core';

type Bump = 'major' | 'minor' | 'patch';

const bumpVersion = (versionNumber: string, bump: Bump, prefix: string) => {
  const [major = 0, minor = 0, patch = 0] = versionNumber
    .split('.')
    .map(Number);
  switch (bump) {
    case 'major':
      return `${prefix}${major + 1}.0.0`;
    case 'minor':
      return `${prefix}${major}.${minor + 1}.0`;
    case 'patch':
      return `${prefix}${major}.${minor}.${patch + 1}`;
  }
};

const incrementVersion = () => {
  const versionNumber = getInput('versionNumber');
  const bump = getInput('bump') as Bump;
  const prefix = getInput('prefix');
  const nextVersion = bumpVersion(versionNumber, bump, prefix);
  setOutput('nextVersion', nextVersion);
};

try {
  incrementVersion();
} catch (error) {
  setFailed(`${(error as any)?.message ?? error}`);
}

import { getInput, setFailed, setOutput } from '@actions/core';
import { getOctokit } from '@actions/github';

type Exclusion = '' | 'prerelease' | 'draft';

const getFilterPredicate = (exclude: Exclusion[]) => {
  if (exclude.includes('prerelease') && exclude.includes('draft')) {
    return (release: any) => !release.prerelease && !release.draft;
  }
  if (exclude.includes('prerelease')) {
    return (release: any) => !release.prerelease;
  }
  if (exclude.includes('draft')) {
    return (release: any) => !release.draft;
  }
  return () => true;
};

const getLatestRelease = async () => {
  const repository = 'Microsoft/TypeScript';
  // const repository = getInput('repository');
  const [owner, repo] = repository.split('/');
  const token = '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';
  // const token = getInput('token');
  const exclude = 'prerelease,draft'.split(',') as Exclusion[];
  // const exclude = getInput('exclude').split(',') as Exclusion[];

  const octokit = getOctokit(token);

  const { data: releases } = await octokit.rest.repos.listReleases({
    owner,
    repo,
  });

  const filteredReleases = releases.filter(getFilterPredicate(exclude));
  if (!filteredReleases.length) {
    setFailed('No releases found.');
  }

  const latestRelease = (
    filteredReleases[0].tag_name.match(/\d+(\.?\d?)+/g) || []
  ).join('');
  setOutput('latestRelease', latestRelease);
};

try {
  getLatestRelease();
} catch (error) {
  setFailed(`${(error as any)?.message ?? error}`);
}

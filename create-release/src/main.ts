import { getInput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

type Latest = '' | 'true' | 'false' | 'legacy';

const createRelease = async () => {
  const repository = getInput('repository');
  const [owner, repo] = repository.split('/');
  const tagName = getInput('tagName');
  const targetCommitish = getInput('targetCommitish');
  const name = getInput('name');
  const body = getInput('body');
  const draft = getInput('draft').toLowerCase() === 'true';
  const prerelease = getInput('prerelease').toLowerCase() === 'true';
  const discussionCategoryName = getInput('discussionCategoryName');
  const generateReleaseNotes =
    getInput('generateReleaseNotes').toLowerCase() === 'true';
  const makeLatest = getInput('makeLatest') as Latest;
  const token = getInput('token');

  const octokit = getOctokit(token);

  await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    target_commitish: targetCommitish,
    ...(name && { name }),
    ...(body && { body }),
    draft,
    prerelease,
    ...(discussionCategoryName && {
      discussion_category_name: discussionCategoryName,
    }),
    generate_release_notes: generateReleaseNotes,
    ...(makeLatest && { make_latest: makeLatest }),
  });
};

try {
  createRelease();
} catch (error) {
  setFailed(`${(error as any)?.message ?? error}`);
}

import { getInput, setFailed, setOutput } from '@actions/core';
import { getOctokit } from '@actions/github';

const generateReleaseNotes = async () => {
  const repository = getInput('repository');
  const [owner, repo] = repository.split('/');
  const tagName = getInput('tagName');
  const targetCommitish = getInput('targetCommitish');
  const previousTagName = getInput('previousTagName');
  const configurationFilePath = getInput('configurationFilePath');
  const token = getInput('token');

  const octokit = getOctokit(token);

  const {
    data: { name, body },
  } = await octokit.rest.repos.generateReleaseNotes({
    owner,
    repo,
    tag_name: tagName,
    target_commitish: targetCommitish,
    ...(previousTagName && { previous_tag_name: previousTagName }),
    ...(configurationFilePath && {
      configuration_file_path: configurationFilePath,
    }),
  });

  setOutput('name', name);
  setOutput('body', body);
};

try {
  generateReleaseNotes();
} catch (error) {
  setFailed(`${(error as any)?.message ?? error}`);
}

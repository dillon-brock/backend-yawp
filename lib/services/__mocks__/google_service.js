/* eslint-disable no-console */
const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGoogleProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return {
    email: 'not.real@example.com',
    given_name: 'Not',
    family_name: 'Real',
  };
};

module.exports = { exchangeCodeForToken, getGoogleProfile };

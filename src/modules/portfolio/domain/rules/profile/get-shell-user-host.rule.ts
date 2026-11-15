const SHELL_HOST = 'portfolio';

/** Shell users have no spaces, so only the first name becomes the user: "Lucas Reis" is lucas@portfolio. */
export function getShellUserHost(profileName: string): string {
  const [firstName = ''] = profileName.trim().toLowerCase().split(/\s+/);
  return `${firstName}@${SHELL_HOST}`;
}

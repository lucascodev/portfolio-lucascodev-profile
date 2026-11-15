const SHELL_HOST = 'portfolio';

export function getShellUserHost(profileName: string): string {
  const [firstName = ''] = profileName.trim().toLowerCase().split(/\s+/);
  return `${firstName}@${SHELL_HOST}`;
}

import { TERMINAL_APP_ALIASES } from '@/modules/portfolio/domain/constants/terminal-app-aliases.constant';
import { TERMINAL_FILES } from '@/modules/portfolio/domain/constants/terminal-files.constant';

const ARGUMENT_CANDIDATES_BY_COMMAND = new Map<string, readonly string[]>([
  ['cat', Object.keys(TERMINAL_FILES)],
  ['open', Object.keys(TERMINAL_APP_ALIASES)],
]);

export function listTerminalArgumentCandidates(command: string): readonly string[] {
  return ARGUMENT_CANDIDATES_BY_COMMAND.get(command.toLowerCase()) ?? [];
}

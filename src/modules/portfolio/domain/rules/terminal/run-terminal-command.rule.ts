import { buildAboutDocument } from '@/modules/portfolio/domain/rules/about/build-about-document.rule';
import { toMarkdownSource } from '@/modules/portfolio/domain/rules/markdown/to-markdown-source.rule';
import { getShellUserHost } from '@/modules/portfolio/domain/rules/profile/get-shell-user-host.rule';
import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';
import type { Skill } from '@/modules/portfolio/domain/types/skill.type';
import type { TerminalCommandResult } from '@/modules/portfolio/domain/types/terminal/terminal-command-result.type';
import type { TerminalContext } from '@/modules/portfolio/domain/types/terminal/terminal-context.type';
import type { TerminalOutputLine } from '@/modules/portfolio/domain/types/terminal/terminal-output-line.type';

type CommandHandler = (args: readonly string[], context: TerminalContext) => TerminalCommandResult;

const line = (text: string, tone: TerminalOutputLine['tone'] = 'default'): TerminalOutputLine => ({ text, tone });
const output = (...lines: TerminalOutputLine[]): TerminalCommandResult => ({ lines });
const skillNames = (skills: readonly Skill[]) => skills.map((skill) => skill.name);

const APP_ALIASES: Readonly<Record<string, DesktopAppId>> = {
  terminal: 'terminal',
  sobre: 'about',
  about: 'about',
  projetos: 'projects',
  projects: 'projects',
  stack: 'stack',
  contato: 'contact',
  contact: 'contact',
};

const FILES: Readonly<Record<string, string>> = {
  'sobre.md': 'sobre',
  'stack.txt': 'stack',
  'contato.txt': 'contato',
};

const NEOFETCH_ART = ['   ___   ', '  / _ \\  ', ' | |_| | ', ' |  _  | ', ' |_| |_| '];

const showHelp: CommandHandler = () =>
  output(
    line('Comandos disponíveis:', 'accent'),
    line('  whoami            quem sou eu'),
    line('  sobre             um pouco sobre mim'),
    line('  projetos          o que eu já construí'),
    line('  stack             tecnologias que uso'),
    line('  contato           como falar comigo'),
    line('  neofetch          informações do sistema'),
    line('  ls / cat <arq>    arquivos da home'),
    line('  open <app>        abre um app (sobre, projetos, stack, contato)'),
    line('  clear             limpa a tela'),
    line('  exit              desliga e volta para o setup'),
  );

const showWhoami: CommandHandler = (_, { content }) => output(line(`${content.profile.name} — ${content.profile.role}`, 'accent'));

const showAbout: CommandHandler = (_, { content }) =>
  output(
    ...buildAboutDocument(content.profile).map((markdownLine) =>
      line(toMarkdownSource(markdownLine), markdownLine.kind === 'heading' ? 'accent' : 'default'),
    ),
  );

const showProjects: CommandHandler = (_, { content }) =>
  output(
    ...content.projects.flatMap((project) => [
      line(`▸ ${project.title}`, 'accent'),
      line(`  ${project.description}`),
      line(`  ${project.tags.join(' · ')}`, 'muted'),
    ]),
  );

const showStack: CommandHandler = (_, { content }) =>
  output(...content.skillGroups.map((group) => line(`${group.title.padEnd(12)} ${skillNames(group.skills).join(', ')}`)));

const showContact: CommandHandler = (_, { content }) =>
  output(
    line(`email     ${content.profile.email}`, 'accent'),
    ...content.profile.socialLinks.map((link) => line(`${link.label.toLowerCase().padEnd(9)} ${link.url}`)),
  );

const showNeofetch: CommandHandler = (_, { content }) => {
  const userHost = getShellUserHost(content.profile.name);
  const info = [
    line(userHost, 'accent'),
    line('-'.repeat(userHost.length), 'muted'),
    line('OS: Linux (portfolio edition) x86_64'),
    line('Shell: zsh 5.9'),
    line(`Cargo: ${content.profile.role}`),
    line(`Stack: ${content.skillGroups.flatMap((group) => skillNames(group.skills)).slice(0, 4).join(', ')}`),
    line(`Projetos: ${content.projects.length}`),
  ];
  return output(
    ...info.map((infoLine, index) => line(`${NEOFETCH_ART[index] ?? ' '.repeat(9)}  ${infoLine.text}`, infoLine.tone)),
  );
};

const listFiles: CommandHandler = () => output(line('sobre.md  projetos/  stack.txt  contato.txt', 'accent'));

const COMMANDS: Readonly<Record<string, CommandHandler>> = {
  help: showHelp,
  ajuda: showHelp,
  whoami: showWhoami,
  sobre: showAbout,
  about: showAbout,
  projetos: showProjects,
  projects: showProjects,
  stack: showStack,
  contato: showContact,
  contact: showContact,
  neofetch: showNeofetch,
  ls: listFiles,
  cat: (args, context) => {
    const command = FILES[args[0] ?? ''];
    if (!command) return output(line(`cat: ${args[0] ?? ''}: arquivo não encontrado`, 'error'));
    return COMMANDS[command](args, context);
  },
  open: (args) => {
    const appId = APP_ALIASES[args[0] ?? ''];
    if (!appId) return output(line(`open: app desconhecido "${args[0] ?? ''}"`, 'error'));
    return { lines: [line(`abrindo ${args[0]}...`, 'muted')], effect: { kind: 'open-app', appId } };
  },
  date: (_, { now }) => output(line(now.toLocaleString('pt-BR'))),
  echo: (args) => output(line(args.join(' '))),
  sudo: () => output(line('Permissão negada. Boa tentativa 😄', 'error')),
  clear: () => ({ lines: [], effect: { kind: 'clear' } }),
  exit: () => ({ lines: [line('Desligando...', 'muted')], effect: { kind: 'power-off' } }),
};

export function runTerminalCommand(input: string, context: TerminalContext): TerminalCommandResult {
  const [command = '', ...args] = input.trim().split(/\s+/);
  if (command === '') return output();

  const handler = COMMANDS[command.toLowerCase()];
  if (!handler) return output(line(`${command}: comando não encontrado. Digite "help" para ver os comandos.`, 'error'));
  return handler(args, context);
}

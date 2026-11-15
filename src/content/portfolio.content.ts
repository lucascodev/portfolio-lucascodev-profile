import type { PortfolioContent, Skill, SkillLevel } from '@/modules/portfolio';

const GITHUB_URL = 'https://github.com/lucascodev';
const repository = (name: string) => `${GITHUB_URL}/${name}`;
const skill = (name: string, level: SkillLevel): Skill => ({ name, level });

export const portfolioContent: PortfolioContent = {
  profile: {
    name: 'Lucas Reis',
    role: 'Desenvolvedor Full Stack',
    headline: 'Transformando ideias em produtos que funcionam.',
    location: 'Santa Fé do Sul, SP · remoto',
    summary: [
      'Meu nome é Lucas, sou desenvolvedor full stack e estudante de Engenharia de Software. Comecei no PHP, com Laravel, e hoje trabalho principalmente no ecossistema JavaScript, como Especialista em Desenvolvimento de Software na **FITec** desde 2023.',
      'Minha experiência abrange tanto a criação de interfaces em **React**, **Next.js** e **TypeScript** quanto a construção de APIs em **NestJS**, apps em **React Native** e integrações IoT com MQTT. Meu objetivo é entregar produtos bem construídos, com código organizado em Clean Architecture e tipagem forte, que chegam de fato a quem usa.',
    ],
    about: [
      {
        title: 'Agora',
        items: [
          'Sou **Especialista em Desenvolvimento de Software** na **FITec**, onde estou desde 2023.',
          '**CLAMPER Mobi Smart**: trabalho na plataforma IoT de recarga de veículos elétricos, do portal em Next.js com Clean Architecture às APIs NestJS com MQTT e JWT e ao app React Native com push e geolocalização.',
          '**Acer Conecta**: levei o front-end de React JS para TypeScript, Vite e Ant Design, com CI/CD na AWS.',
          '**SAVE**: como front-end, desenvolvi o app desktop em Flutter e adicionei uma camada de BFF em C++ ao sistema de autenticação veicular com IA, que foi apresentado no **Campinas Innovation Week 2026**!',
        ],
      },
      {
        title: 'Aura Cubic Digital',
        items: [
          'Fundei a **Aura Cubic Digital** para dar vida aos meus próprios produtos e criar sistemas sob medida.',
          '**Aura Cubic CRM**: um CRM por assinatura pensado para quem vende por WhatsApp, telefone e indicação.',
          '**Mistura Certa**: um app de receitas com plano semanal de refeições e lista de compras, disponível no Google Play.',
        ],
      },
      {
        title: 'Freelas, desde 2022',
        items: [
          'Criei um jogo 2D em Unity para o stand da **Seven Boys**, marca do grupo **Wickbold**, na **Campus Party Brasil**.',
          'Desenvolvi para a **DTCOM** um globo 3D interativo em Three.js e Laravel, que mostra as confederações de futebol pelo mundo.',
          'Construí um sistema para médicos em React, com cadastro de pacientes, prontuários e monitoramento de Covid.',
        ],
      },
      {
        title: 'Formação',
        items: ['Curso Engenharia de Software na **UNIASSELVI**.', 'Sou Técnico em Desenvolvimento Web pela **TreinaWeb**.'],
      },
      {
        title: 'Certificações',
        items: [
          '**GitHub Copilot** · GitHub, 2025',
          'GitHub Copilot Challenge · Microsoft, 2025',
          'NLW Agents: Avançado · Rocketseat, 2025',
          'Carreira IA: do zero ao primeiro agente com n8n · Rocketseat, 2026',
        ],
      },
      {
        title: 'Este portfólio',
        items: [
          'O setup lá fora é o meu de verdade, desenhado peça por peça em Three.js. Desligue o desktop e passe o mouse nos itens para conhecer cada um!',
        ],
      },
    ],
    email: 'lucas.codev@hotmail.com',
    socialLinks: [
      { label: 'GitHub', url: GITHUB_URL },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/lucas-pereira-dos-reis-60a49b18b' },
    ],
  },
  skillGroups: [
    {
      title: 'front-end',
      skills: [
        skill('TypeScript', 'expert'),
        skill('React', 'expert'),
        skill('Next.js', 'expert'),
        skill('Three.js', 'advanced'),
        skill('Angular', 'advanced'),
        skill('Vite', 'advanced'),
        skill('Tailwind CSS', 'expert'),
        skill('Ant Design', 'advanced'),
      ],
    },
    {
      title: 'back-end',
      skills: [
        skill('Node.js', 'advanced'),
        skill('NestJS', 'advanced'),
        skill('Fastify', 'intermediate'),
        skill('Express', 'advanced'),
        skill('PHP', 'intermediate'),
        skill('Laravel', 'intermediate'),
        skill('Django', 'intermediate'),
        skill('Python', 'intermediate'),
      ],
    },
    {
      title: 'mobile',
      skills: [
        skill('React Native', 'advanced'),
        skill('Expo', 'advanced'),
        skill('Flutter', 'intermediate'),
        skill('Tauri', 'intermediate'),
      ],
    },
    {
      title: 'dados',
      skills: [
        skill('PostgreSQL', 'advanced'),
        skill('MySQL', 'intermediate'),
        skill('Redis', 'intermediate'),
        skill('Prisma', 'advanced'),
        skill('Drizzle', 'intermediate'),
        skill('Firebase', 'intermediate'),
        skill('Supabase', 'intermediate'),
        skill('RabbitMQ', 'beginner'),
        skill('MQTT', 'intermediate'),
        skill('Socket.IO', 'intermediate'),
      ],
    },
    {
      title: 'ferramentas',
      skills: [
        skill('Docker', 'advanced'),
        skill('Kubernetes', 'advanced'),
        skill('AWS', 'intermediate'),
        skill('GitHub Actions', 'intermediate'),
        skill('Jest', 'advanced'),
        skill('Vitest', 'advanced'),
        skill('Figma', 'intermediate'),
        skill('GitHub Copilot', 'advanced'),
      ],
    },
    {
      title: 'jogos',
      skills: [
        skill('Unity', 'intermediate'),
        skill('C#', 'intermediate'),
        skill('Unreal Engine', 'beginner'),
        skill('C++', 'intermediate'),
        skill('Lua', 'intermediate'),
      ],
    },
  ],
  projects: [
    {
      title: 'SAVE — FITec Labs',
      description:
        'O sistema que lê placas por câmera com IA para ajudar a localizar veículos roubados ou clonados! Como front-end, desenvolvi o app desktop em Flutter e adicionei uma camada de BFF em C++, e o projeto foi apresentado no Campinas Innovation Week 2026.',
      tags: ['Flutter', 'C++', 'ONNX', 'OCR'],
    },
    {
      title: 'Aura DataDock DB',
      description:
        'Uma extensão do VS Code para cuidar dos seus bancos sem sair do editor: navegue, consulte, edite e gere gráficos de Postgres, MySQL e MariaDB no Docker, local ou remoto via SSH!',
      tags: ['TypeScript', 'VS Code', 'PostgreSQL', 'MySQL', 'Docker'],
      repositoryUrl: repository('aura-datadock-db'),
    },
    {
      title: 'Aura Cubic CRM',
      description:
        'O CRM por assinatura de quem vende por WhatsApp, telefone e indicação, com funil visual, propostas em PDF, follow-up automático e equipes com permissões!',
      tags: ['NestJS', 'TypeScript', 'Monorepo'],
      liveUrl: 'https://auracubiccrm.com.br',
    },
    {
      title: 'Mistura Certa',
      description:
        'Um app de receitas para decidir o que cozinhar: busque por nome ou ingrediente, monte o plano semanal de refeições e saia com a lista de compras pronta. Gratuito, com plano Premium, no Google Play!',
      tags: ['React Native', 'Next.js', 'NestJS', 'Prisma'],
      liveUrl: 'https://play.google.com/store/apps/details?id=com.auracubic.misturacerta',
    },
    {
      title: 'Aura Monitor',
      description:
        'Acompanhe o hardware em tempo real com agente desktop, API e dashboard em modo kiosk. O Aura Deck, um app mobile de stream deck, consome as métricas pela rede local!',
      tags: ['Tauri', 'React', 'NestJS', 'Socket.IO', 'Flutter'],
    },
    {
      title: 'Aura Questor',
      description:
        'Um rastreador de objetivos para World of Warcraft que reúne missões, conquistas, profissões e eventos em uma janela própria. Publicado no CurseForge!',
      tags: ['Lua', 'WoW Addon'],
      repositoryUrl: repository('aura-questor'),
      liveUrl: 'https://www.curseforge.com/wow/addons/aura-questor',
    },
    {
      title: 'Aura Crypto Miner',
      description: 'Um jogo tycoon de mineração de criptomoedas em 3D isométrico!',
      tags: ['Unreal Engine 5', 'C++'],
    },
    {
      title: 'Lambda Common Name',
      description: 'Uma AWS Lambda que extrai o Common Name (CN) de um certificado PEM.',
      tags: ['Node.js', 'AWS Lambda'],
      repositoryUrl: repository('lambda-get-common-name'),
    },
    {
      title: 'Este portfólio',
      description: 'Meu setup de verdade, modelado em Three.js a partir de um arquivo de configuração, com telas animadas em canvas!',
      tags: ['React', 'Three.js', 'R3F'],
    },
  ],
};

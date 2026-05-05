import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.contact.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteConfig.deleteMany();

  const adminEmail = process.env['ADMIN_EMAIL'];
  const adminPassword = process.env['ADMIN_PASSWORD'];

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({ data: { email: adminEmail, passwordHash } });

  await prisma.project.createMany({
    data: [
      {
        slug: 'clamper-mobi-smart',
        title: 'CLAMPER Mobi Smart',
        shortDescription:
          'Plataforma IoT para gestão de recargas de veículos elétricos com portal web, APIs e app mobile.',
        fullDescription:
          'Desenvolvido na FITec, o CLAMPER Mobi Smart é uma solução completa para gestão de estações de recarga de veículos elétricos. Atuei como Fullstack em todo o ecossistema: portal web responsivo com Next.js 15 e React 19, APIs RESTful com NestJS integradas via MQTT para comunicação IoT em tempo real, apps React Native cross-platform com push notifications e geolocalização, e banco de dados com Prisma ORM. Implementação de LGPD, testes automatizados e CI/CD em metodologia ágil.',
        coverImage: '/projects/clamper/cover.jpg',
        images: ['/projects/clamper/01.jpg'],
        techStack: [
          'Next.js',
          'React',
          'TypeScript',
          'NestJS',
          'React Native',
          'MQTT',
          'Prisma',
          'Firebase',
        ],
        category: 'fullstack',
        status: 'in_progress',
        featured: true,
        order: 1,
      },
      {
        slug: 'acer-conecta',
        title: 'Acer Conecta',
        shortDescription:
          'Migração e modernização de plataforma front-end React JS para React TypeScript com Vite e Ant Design.',
        fullDescription:
          'Projeto desenvolvido na FITec para a Acer. Realizei a migração completa do front-end legado em React JS para React TypeScript com Vite e Ant Design, otimizando performance e aplicando boas práticas de UI/UX. Atuei também em módulos Next.js e integração com backend Laravel. Utilizei AWS CodeCommit e CodePipeline para CI/CD e colaborei com times multidisciplinares em metodologia ágil.',
        coverImage: '/projects/acer-conecta/cover.jpg',
        images: ['/projects/acer-conecta/01.jpg'],
        techStack: ['React', 'TypeScript', 'Vite', 'Ant Design', 'Next.js', 'Laravel', 'AWS'],
        category: 'frontend',
        status: 'completed',
        featured: true,
        order: 2,
      },
      {
        slug: 'seven-boys-game',
        title: 'Seven Boys — Campus Party',
        shortDescription:
          'Jogo 2D em Unity/C# desenvolvido para o stand da Seven Boys na Campus Party Brasil.',
        fullDescription:
          'Jogo 2D desenvolvido em Unity com C# para a marca Seven Boys, apresentado no stand da empresa durante a Campus Party Brasil em São Paulo. O jogo foi criado como experiência interativa para o público do evento, demonstrando a aplicação de desenvolvimento de jogos em contexto de marketing experiencial.',
        coverImage: '/projects/seven-boys/cover.jpg',
        images: ['/projects/seven-boys/01.jpg'],
        techStack: ['Unity', 'C#'],
        category: 'game',
        status: 'completed',
        featured: true,
        order: 3,
      },
      {
        slug: 'dtcom-globo-3d',
        title: 'DTCOM — Globo 3D Interativo',
        shortDescription:
          'Globo terrestre 3D interativo em Three.js mostrando as confederações de futebol ao redor do mundo.',
        fullDescription:
          'Projeto desenvolvido para a DTCOM em parceria com uma instituição escolar. Criei um globo terrestre 3D totalmente interativo usando Three.js com backend em Laravel, onde o usuário pode explorar o mapa mundial e visualizar a localização geográfica das confederações de futebol. Projeto destaque pela inovação visual e interatividade.',
        coverImage: '/projects/dtcom-globe/cover.jpg',
        images: ['/projects/dtcom-globe/01.jpg'],
        techStack: ['Three.js', 'JavaScript', 'Laravel'],
        category: 'frontend',
        status: 'completed',
        featured: false,
        order: 4,
      },
    ],
  });

  await prisma.skill.createMany({
    data: [
      { name: 'React', category: 'frontend', level: 'expert', order: 1 },
      { name: 'Next.js', category: 'frontend', level: 'expert', order: 2 },
      { name: 'TypeScript', category: 'frontend', level: 'expert', order: 3 },
      { name: 'JavaScript', category: 'frontend', level: 'expert', order: 4 },
      { name: 'Vite', category: 'frontend', level: 'proficient', order: 5 },
      { name: 'Ant Design', category: 'frontend', level: 'proficient', order: 6 },
      { name: 'React Native', category: 'mobile', level: 'expert', order: 1 },
      { name: 'Flutter', category: 'mobile', level: 'proficient', order: 2 },
      { name: 'NestJS', category: 'backend', level: 'expert', order: 1 },
      { name: 'Node.js', category: 'backend', level: 'expert', order: 2 },
      { name: 'Laravel', category: 'backend', level: 'proficient', order: 3 },
      { name: 'Prisma ORM', category: 'database', level: 'expert', order: 1 },
      { name: 'Firebase', category: 'database', level: 'proficient', order: 2 },
      { name: 'PostgreSQL', category: 'database', level: 'proficient', order: 3 },
      { name: 'MQTT', category: 'devops', level: 'proficient', order: 1 },
      { name: 'AWS', category: 'devops', level: 'proficient', order: 2 },
      { name: 'Unity / C#', category: 'other', level: 'proficient', order: 1 },
      { name: 'Three.js', category: 'other', level: 'proficient', order: 2 },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        company: 'Fundação para Inovações Tecnológicas — FITec',
        role: 'Software Development Specialist',
        description:
          'Desenvolvedor Fullstack em soluções IoT para gestão de recargas de veículos elétricos (CLAMPER Mobi Smart) e migração de plataforma front-end (Acer Conecta). Frontend com Next.js 15, React 19 e TypeScript; backend com NestJS e integração IoT via MQTT; apps React Native cross-platform. Implementação de LGPD, Clean Architecture, testes automatizados e CI/CD via AWS CodeCommit/CodePipeline.',
        techStack: [
          'Next.js',
          'React',
          'TypeScript',
          'NestJS',
          'React Native',
          'MQTT',
          'Prisma',
          'AWS',
          'Laravel',
        ],
        startDate: new Date('2023-03-01'),
        endDate: null,
        current: true,
        order: 1,
      },
      {
        company: 'LP Sistema de Segurança',
        role: 'CEO & Desenvolvedor Fullstack Freelancer',
        description:
          'Desenvolvimento de sistemas web, sites institucionais e jogos digitais. Destaques: jogo 2D em Unity/C# para a Seven Boys no stand da Campus Party Brasil; globo terrestre 3D interativo com Three.js para a DTCOM; sistema médico em React com cadastro de pacientes, prontuários e monitoramento de Covid.',
        techStack: [
          'React',
          'Next.js',
          'NestJS',
          'Node.js',
          'TypeScript',
          'Unity',
          'C#',
          'Three.js',
          'Laravel',
        ],
        startDate: new Date('2022-02-01'),
        endDate: null,
        current: true,
        order: 2,
      },
      {
        company: 'Flash Cover Capotas Marítimas',
        role: 'Analista de Desenvolvimento de Sistemas',
        description: 'Atuação como analista e auxiliar de desenvolvimento de sistemas internos.',
        techStack: ['JavaScript', 'Web'],
        startDate: new Date('2021-02-01'),
        endDate: new Date('2022-02-01'),
        current: false,
        order: 3,
      },
    ],
  });

  await prisma.siteConfig.create({
    data: {
      heroGreeting: 'Olá, eu sou',
      heroName: 'Lucas Pereira dos Reis',
      heroRole: 'Software Development Specialist',
      heroDescription:
        'Especialista em desenvolvimento Fullstack na FITec, trabalho com React, Next.js, TypeScript, NestJS e React Native. CEO & freelancer desde 2022, criando sistemas web, mobile e jogos digitais.',
      profileImageUrl: '/avatar.jpg',
      heroTags: ['React', 'Next.js', 'TypeScript', 'NestJS', 'React Native', 'IoT'],
      aboutTitle: 'Sobre mim',
      aboutParagraph1:
        'Sou Especialista em Desenvolvimento de Software na FITec, onde lidero a transição e otimização de plataformas usando React, Next.js e TypeScript. Atuo como desenvolvedor Fullstack em soluções IoT para gestão de recargas de veículos elétricos, trabalhando com NestJS, MQTT e React Native.',
      aboutParagraph2:
        'Como CEO & freelancer da LP Sistema de Segurança desde 2022, desenvolvo sistemas web, mobile e jogos digitais. Já criei um jogo 2D em Unity/C# para a Seven Boys na Campus Party Brasil e um globo 3D interativo em Three.js para a DTCOM. Cursando Engenharia de Software na UNIASSELVI, com formação técnica em Desenvolvimento Web pela TreinaWeb.',
      aboutTags: ['Clean Architecture', 'IoT', 'Fullstack', 'Mobile', 'Game Dev'],
      footerBio:
        'Software Development Specialist na FITec. Fullstack, Mobile e Game Dev desde 2021.',
      footerNavLinks: [
        { label: 'Projetos', href: '/projects' },
        { label: 'Sobre', href: '/about' },
        { label: 'Contato', href: '/contact' },
      ],
      footerSocialLinks: [
        { label: 'GitHub', href: 'https://github.com/lucascodev' },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/lucas-pereira-dos-reis-60a49b18b/',
        },
      ],
    },
  });

  console.log('✅ Seed concluído com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

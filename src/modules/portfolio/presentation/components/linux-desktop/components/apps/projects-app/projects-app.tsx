import { useState } from 'react';
import type { Project } from '@/modules/portfolio/domain/types/project.type';
import { AppIcon } from '@/modules/portfolio/presentation/components/linux-desktop/components/app-icon/app-icon';
import styles from './projects-app.module.css';

interface ProjectsAppProps {
  readonly projects: readonly Project[];
}

const SIDEBAR_PLACES = ['Pessoal', 'Projetos', 'Downloads', 'Lixeira'] as const;
const ACTIVE_PLACE = 'Projetos';

export function ProjectsApp({ projects }: ProjectsAppProps) {
  const [selectedTitle, setSelectedTitle] = useState(projects[0]?.title);
  const selected = projects.find((project) => project.title === selectedTitle);

  return (
    <div className={styles.fileManager}>
      <aside className={styles.sidebar}>
        {SIDEBAR_PLACES.map((place) => (
          <span key={place} className={styles.place} data-active={place === ACTIVE_PLACE}>
            {place}
          </span>
        ))}
      </aside>

      <div className={styles.main}>
        <p className={styles.path}>~/projetos</p>
        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.title}>
              <button
                type="button"
                className={styles.folder}
                data-selected={project.title === selectedTitle}
                onClick={() => setSelectedTitle(project.title)}
              >
                <span className={styles.folderIcon}>
                  <AppIcon appId="projects" />
                </span>
                <span className={styles.folderName}>{project.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <section className={styles.details} aria-live="polite">
            <h3 className={styles.detailsTitle}>{selected.title}</h3>
            <p className={styles.description}>{selected.description}</p>
            <ul className={styles.tags}>
              {selected.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className={styles.links}>
              {selected.repositoryUrl && (
                <a href={selected.repositoryUrl} target="_blank" rel="noreferrer">
                  Código ↗
                </a>
              )}
              {selected.liveUrl && (
                <a href={selected.liveUrl} target="_blank" rel="noreferrer">
                  Ver online ↗
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

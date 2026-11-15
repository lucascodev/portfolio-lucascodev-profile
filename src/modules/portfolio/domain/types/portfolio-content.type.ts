import type { Profile } from './profile.type';
import type { Project } from './project.type';
import type { SkillGroup } from './skill-group.type';

export interface PortfolioContent {
  readonly profile: Profile;
  readonly skillGroups: readonly SkillGroup[];
  readonly projects: readonly Project[];
}

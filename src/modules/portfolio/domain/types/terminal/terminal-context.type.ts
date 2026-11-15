import type { PortfolioContent } from '@/modules/portfolio/domain/types/portfolio-content.type';

export interface TerminalContext {
  readonly content: PortfolioContent;
  readonly now: Date;
}

import type { DesktopAppId } from '@/modules/portfolio/domain/types/desktop/desktop-app-id.type';

export interface DesktopAppDefinition {
  readonly id: DesktopAppId;
  readonly title: string;
  readonly defaultSize: { readonly width: number; readonly height: number };
}

import type { ScreenContent } from '@/modules/setup/domain/types/monitor/screen-content.type';
import type { PhoneModel } from './phone-model.type';

export interface PhoneSpec {
  readonly color: string;
  readonly screen: ScreenContent;
  readonly model?: PhoneModel;
  readonly caseColor?: string;
}

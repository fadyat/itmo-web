import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'AUTH_MODULE_CONFIG';

export type AuthModuleConfig = {
  connectionUri: string;
  apiKey: string;
  appInfo: AppInfo;
};

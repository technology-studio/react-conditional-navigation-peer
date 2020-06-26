/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-08T18:41:06+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { ConfigManager } from '@txo/config-manager'
import type { LiteralMap } from '@txo/flow'

import type { NavigatorType } from '../Model/Types'

export type Config = {
  ignoreConditionalNavigation: boolean,
  routeNameToNavigatorTypeMap: LiteralMap<string, NavigatorType>,
}

export const configManager: ConfigManager<Config> = new ConfigManager({
  ignoreConditionalNavigation: false,
  routeNameToNavigatorTypeMap: {},
})

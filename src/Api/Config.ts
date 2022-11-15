/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-15T09:11:27+01:00
 * @Copyright: Technology Studio
**/

import { ConfigManager } from '@txo/config-manager'

import type { Condition } from '../Model/Types'

export type Config = {
  screenConditionsMap: Record<string, Condition[]>,
}

export const configManager: ConfigManager<Config> = new ConfigManager<Config>({
  screenConditionsMap: {},
})

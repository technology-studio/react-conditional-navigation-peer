/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-15T13:11:31+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
} from 'react'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'

import type {
  OnAction,
  OnActionFactoryAttributes,
  UseOnActionOptions,
} from '../Model/Types'
import { configManager } from '../Config'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useOnActionObject = require('@react-navigation/core/lib/commonjs/useOnAction')
const originalUseOnAction = useOnActionObject.default as typeof UseOnActionType

let onActionFactory: ((onAction: OnAction) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>) => boolean) | null = null

export const registerOnActionFactory = (_onActionFactory: typeof onActionFactory): void => {
  onActionFactory = _onActionFactory
}

useOnActionObject.default = function useOnAction (options: UseOnActionOptions): OnAction {
  const onAction = originalUseOnAction(options) as OnAction
  const { getState, setState, router, routerConfigOptions } = options ?? {}
  const nextOnAction: typeof onAction = useCallback((...args: Parameters<OnAction>) => {
    const screenConditionsMap = configManager.config.screenConditionsMap

    if (onActionFactory) {
      return onActionFactory(onAction)({
        getState,
        nextOnAction,
        screenConditionsMap,
        setState,
        router,
        routerConfigOptions,
      }, ...args)
    }

    return onAction(...args)
  }, [getState, onAction, router, routerConfigOptions, setState])

  return nextOnAction
}

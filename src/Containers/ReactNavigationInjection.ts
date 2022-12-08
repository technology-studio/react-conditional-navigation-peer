/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-15T13:11:31+01:00
 * @Copyright: Technology Studio
**/

import {
  useCallback,
  useContext,
} from 'react'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'
import type NavigationContainerRefContextType from '@react-navigation/core/lib/typescript/src/NavigationContainerRefContext'

import type {
  OnAction,
  OnActionFactoryAttributes,
  UseOnActionOptions,
} from '../Model/Types'
import { screenConditionConfigMap } from '../Api/ConditionManager'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useOnActionObject = require('@react-navigation/core/lib/commonjs/useOnAction')
const originalUseOnAction = useOnActionObject.default as typeof UseOnActionType
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NavigationContainerRefContextObject = require('@react-navigation/core/lib/commonjs/NavigationContainerRefContext')
const NavigationContainerRefContext = NavigationContainerRefContextObject.default as typeof NavigationContainerRefContextType

let onActionFactory: ((onAction: OnAction) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>) => boolean) | null = null

export const registerOnActionFactory = (_onActionFactory: typeof onActionFactory): void => {
  onActionFactory = _onActionFactory
}

useOnActionObject.default = function useOnAction (options: UseOnActionOptions): OnAction {
  const onAction = originalUseOnAction(options) as OnAction
  const { getState, setState, router, routerConfigOptions } = options ?? {}
  const navigationContainerRefContext = useContext(NavigationContainerRefContext)

  const nextOnAction: typeof onAction = useCallback((...args: Parameters<OnAction>) => {
    if (onActionFactory) {
      return onActionFactory(onAction)({
        getState,
        getRootState: navigationContainerRefContext?.getRootState,
        nextOnAction,
        screenConditionConfigMap,
        setState,
        router,
        routerConfigOptions,
      }, ...args)
    }

    return onAction(...args)
  }, [getState, navigationContainerRefContext?.getRootState, onAction, router, routerConfigOptions, setState])

  return nextOnAction
}

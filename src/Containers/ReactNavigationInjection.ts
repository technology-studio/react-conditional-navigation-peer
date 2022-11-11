import {
  useCallback,
} from 'react'
import type UseOnActionType from '@react-navigation/core/lib/typescript/src/useOnAction'

import type {
  Condition,
  OnAction,
  OnActionFactoryAttributes,
  UseOnActionOptions,
} from '../Model/Types'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useOnActionObject = require('@react-navigation/core/lib/commonjs/useOnAction')
const originalUseOnAction = useOnActionObject.default as typeof UseOnActionType

let onActionFactory: ((onAction: ReturnType<typeof UseOnActionType>) => (attributes: OnActionFactoryAttributes, ...args: Parameters<OnAction>) => boolean) | null = null

export const registerOnActionFactory = (_onActionFactory: typeof onActionFactory): void => {
  onActionFactory = _onActionFactory
}

useOnActionObject.default = function useOnAction (options: UseOnActionOptions): OnAction {
  const onAction = originalUseOnAction(options)
  const { getState, setState } = options ?? {}
  const nextOnAction: typeof onAction = useCallback((...args: Parameters<OnAction>) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const screenConditionsMap: Record<string, Condition[]> = require('../../../Navigation/ScreenList').screenConditionsMap

    if (onActionFactory) {
      return onActionFactory(onAction)({
        getState,
        nextOnAction,
        screenConditionsMap,
        setState,
      }, ...args)
    }

    return onAction(...args)
  }, [getState, onAction, setState])

  return nextOnAction
}

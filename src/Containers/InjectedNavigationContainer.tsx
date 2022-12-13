/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-10-24T15:10:50+02:00
 * @Copyright: Technology Studio
**/

import React, {
  useEffect,
} from 'react'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { useFlipper } from '@react-navigation/devtools'

import {
  onActionFactory,
} from '../Navigation/OnActionFactory'
import type { ResolveConditionContext } from '../Model/Types'

import { registerOnActionFactory } from './ReactNavigationInjection'

type Props = {
  children: React.ReactNode,
  getContext?: () => ResolveConditionContext,
}

export const InjectedNavigationContainer = ({ children, getContext }: Props): JSX.Element => {
  const navigationRef = useNavigationContainerRef()
  useFlipper(navigationRef)

  useEffect(() => {
    registerOnActionFactory(onActionFactory, getContext)
  }, [getContext])

  return (
    <NavigationContainer ref={navigationRef}>
      {children}
    </NavigationContainer>
  )
}

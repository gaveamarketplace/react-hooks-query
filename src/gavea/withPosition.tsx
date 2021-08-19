import React from 'react'
import { useQuery } from 'react-query'
import * as positions from './usePositions'

export const withPosition = (Component: any) => (props: any) => {

  const useCornPositions = useQuery([positions.FETCH_CORN_POSITIONS], () =>
    positions.positionCornQuery({ volumeUnit: 1 })
  )

  const useSoyPositions = useQuery([positions.FETCH_SOY_POSITIONS], () =>
    positions.positionSoyQuery({ volumeUnit: 1 })
  )

  const cornProps = {
    data: useCornPositions
  }
  const soyProps = {
    data: useSoyPositions
  }

  const propsData = {
    cornProps,
    soyProps
  }

  console.log('CORN PROPS', cornProps, props)

  // console.log('USE CORN POSITIONS', useCornPositions);
  return <Component {...propsData} />
}

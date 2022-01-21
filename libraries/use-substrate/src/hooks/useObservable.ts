/* eslint-disable @typescript-eslint/no-explicit-any */
import { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T> | undefined, deps: readonly any[]): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined)

  useEffect(() => {
    const subscription = observable?.subscribe(setData)

    return () => subscription && subscription.unsubscribe()
  }, deps)

  return useMemo(() => data, [data])
}

export function useObservable2(observable: Observable<PalletAssetsAssetMetadata[]> | undefined, deps: readonly any[]): PalletAssetsAssetMetadata[] | undefined {
  const [data, setData] = useState<PalletAssetsAssetMetadata[] | undefined>(undefined)
  console.log(data?.forEach((item) => console.log('from observable2', item.name.toHuman())))
  useEffect(() => {
    const subscription = observable?.subscribe(setData)

    return () => subscription && subscription.unsubscribe()
  }, deps)

  return useMemo(() => data, [JSON.stringify(data)])
}

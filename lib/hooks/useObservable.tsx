/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T> | undefined, deps: readonly any[]): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined)

  useEffect(() => {
    const subscription = observable?.subscribe(setData)
    return () => subscription && subscription.unsubscribe()
  }, deps)

  return useMemo(() => data, [data])
}

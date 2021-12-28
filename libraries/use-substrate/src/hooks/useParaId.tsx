import { ParaId } from '@polkadot/types/interfaces'
import { Observable } from 'rxjs'

import { Chains, useApi, useObservable } from '../index'

export function useParaId(chain: Chains): ParaId | undefined {
  const { api, connectionState } = useApi(chain)

  return useObservable<ParaId>(api?.query.parachainInfo?.parachainId() as Observable<ParaId>, [api, connectionState])
}

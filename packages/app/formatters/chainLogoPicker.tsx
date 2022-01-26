import { Chains } from 'use-substrate'

import kusama from '../assets/img/kusama.svg'
import polkadot from '../assets/img/polkadot-white.svg'
import statemine from '../assets/img/statemine.svg'
import westend from '../assets/img/westend.svg'

export const chainLogoPicker = (chain: Chains): string => {
  switch (chain) {
    case Chains.Kusama:
      return kusama
    case Chains.Polkadot:
      return polkadot
    case Chains.Westend:
      return westend
    default:
      return statemine
  }
}

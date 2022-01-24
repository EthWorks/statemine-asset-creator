import { Chains } from 'use-substrate'

import kusama from '../assets/img/kusama.svg'
import polkadot from '../assets/img/polkadot-white.svg'
import statemine from '../assets/img/statemine.svg'

export const chainLogoPicker = (chain: Chains): string => {
  switch (chain) {
    case Chains.Kusama:
      return kusama
    case Chains.Polkadot:
      return polkadot
    case Chains.Statemine:
      return statemine
    // toDo add westend icon
    case Chains.Westend:
      return statemine
    case Chains.Westmint:
      return statemine
    default:
      return statemine
  }
}

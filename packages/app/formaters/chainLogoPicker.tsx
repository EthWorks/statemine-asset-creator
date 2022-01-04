import kusama from '../assets/img/kusama.svg'
import polkadot from '../assets/img/polkadot-white.svg'
import statemine from '../assets/img/statemine.svg'
import { ChainName } from '../globalTypes'

export const chainLogoPicker = (chain: ChainName): string => {
  switch (chain) {
    case 'Kusama':
      return kusama
    case 'Polkadot':
      return polkadot
    case 'Statemint':
      return statemine
    default:
      return statemine
  }
}

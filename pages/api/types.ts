import {SubmittableExtrinsicFunction} from "@polkadot/api/promise/types"
import {ApiPromise} from "@polkadot/api"

export interface ApiProps extends ApiState {
    api: ApiPromise;
    apiError: string | null;
    apiUrl?: string;
    // extensions?: InjectedExtension[];
    isApiConnected: boolean;
    isApiInitialized: boolean;
    isWaitingInjected: boolean;
}

export interface ApiState {
    apiDefaultTx: SubmittableExtrinsicFunction;
    apiDefaultTxSudo: SubmittableExtrinsicFunction;
    hasInjectedAccounts: boolean;
    isApiReady: boolean;
    isDevelopment: boolean;
    isEthereum: boolean;
    specName: string;
    specVersion: string;
    systemChain: string;
    systemName: string;
    systemVersion: string;
}

import { InjectedAccountWithMeta } from './types'

class MockHooks {
  public injectedAccounts: InjectedAccountWithMeta[] = [];

  public setInjectedAccounts (injectedAccounts: InjectedAccountWithMeta[]) {
    this.injectedAccounts = injectedAccounts
  }
}

export const mockHooks = new MockHooks()

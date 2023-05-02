import { InjectedConnector } from '@web3-react/injected-connector';

class PatchedInjectedConnector extends InjectedConnector {
  public off(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    return this;
  }
}

export const injected = new PatchedInjectedConnector({});

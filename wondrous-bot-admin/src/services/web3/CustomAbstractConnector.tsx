

/*
DEPRECATED
*/
import { AbstractConnector } from '@web3-react/abstract-connector';
import walletlink from 'walletlink';


interface WalletLinkConnectorArguments {
    url: string;
    appName: string;
    appLogoUrl?: string;
    darkMode?: boolean;
    supportedChainIds?: number[];
  }
  
const CHAIN_ID = 1;

/**

CustomWalletLinkContainer class is an implementation of AbstractConnector
for WalletLink. This class is used to handle connection with WalletLink
compatible wallets like Coinbase Wallet.
This custom implementation is necessary due to an issue with dynamic imports
on the Vite side that prevents using the official WalletLinkConnector from
'@web3-react/walletlink-connector' package.
@extends {AbstractConnector}
*/



export default class CustomAbstractConnector extends AbstractConnector {
    private readonly url: string;
    private readonly appName: string;
    private readonly appLogoUrl?: string;
    private readonly darkMode: boolean;
  
    public walletLink: any;
    private provider: any;
  
    constructor({
      url,
      appName,
      appLogoUrl,
      darkMode,
      supportedChainIds,
    }: WalletLinkConnectorArguments) {
      super({ supportedChainIds: supportedChainIds });
  
      this.url = url;
      this.appName = appName;
      this.appLogoUrl = appLogoUrl;
      this.darkMode = darkMode || false;
  
      this.handleChainChanged = this.handleChainChanged.bind(this);
      this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    }
  
    public async activate(): Promise<any> {
      // @ts-ignore
      if (window.ethereum && window.ethereum.isCoinbaseWallet === true) {
        // user is in the dapp browser on Coinbase Wallet
        this.provider = window.ethereum;
      } else if (!this.walletLink) {
        const WalletLink = walletlink;
        this.walletLink = new WalletLink({
          appName: this.appName,
          darkMode: this.darkMode,
          ...(this.appLogoUrl ? { appLogoUrl: this.appLogoUrl } : {}),
        });
        this.provider = this.walletLink.makeWeb3Provider(this.url, CHAIN_ID);
      }
  
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
  
      this.provider.on('chainChanged', this.handleChainChanged);
      this.provider.on('accountsChanged', this.handleAccountsChanged);
  
      return { provider: this.provider, account: account };
    }
  
    public async getProvider(): Promise<any> {
      return this.provider;
    }
  
    public async getChainId(): Promise<number> {
      return this.provider.chainId;
    }
  
    public async getAccount(): Promise<null | string> {
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    }
  
    public deactivate() {
      this.provider.removeListener('chainChanged', this.handleChainChanged);
      this.provider.removeListener('accountsChanged', this.handleAccountsChanged);
    }
  
    public async close() {
      this.provider.close();
      this.emitDeactivate();
    }
  
    public off(eventName: string | symbol, listener: (...args: any[]) => void): this {
      return this;
    }
    
    private handleChainChanged(chainId: number | string): void {
      this.emitUpdate({ chainId: chainId });
    }
  
    private handleAccountsChanged(accounts: string[]): void {
      this.emitUpdate({ account: accounts[0] });
    }
  }
  
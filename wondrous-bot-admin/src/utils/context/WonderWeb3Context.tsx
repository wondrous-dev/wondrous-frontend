import { createContext, useState } from 'react';

export interface WonderWeb3ContextShape {
  connecting: boolean;
  setConnecting: (connecting: boolean) => void;
  provider: any;
  setProvider: (provider: any) => void;
  isActivating: boolean;
  setIsActivating: (isActivating: boolean) => void;
}

export const WonderWeb3Context = createContext<WonderWeb3ContextShape>(null);

export function WonderWeb3Provider({ children }) {
  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [isActivating, setIsActivating] = useState(false);

  return (
    <WonderWeb3Context.Provider
      value={{
        connecting,
        setConnecting,
        provider,
        setProvider,
        isActivating,
        setIsActivating,
      }}
    >
      {children}
    </WonderWeb3Context.Provider>
  );
}

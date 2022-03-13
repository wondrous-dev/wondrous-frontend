export interface ConnectorAuthMethods {
  isAuthorized: () => Promise<boolean>;
  getAuthorizedAccount: () => Promise<string | null>;
}

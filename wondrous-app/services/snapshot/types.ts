// Proposal-related types

export interface Vote {
    proposal: string;
    choice: number | [] | object | boolean;
    metadata?: object;
  }
  
  export enum ProposalType {
    singleChoice = 'single-choice',
    approval = 'approval',
    rankedChoice = 'ranked-choice',
    quadratic = 'quadratic',
    weighted = 'weighted',
    custom = 'custom',
    basic = 'basic'
  }
  
  export interface Proposal {
    name: string;
    body: string;
    discussion?: string;
    choices: [];
    type?: ProposalType;
    snapshot: number;
    start: number;
    end: number
    metadata?: object;
  }
  
  // Space-related types
  
  export interface Strategy {
    name: string;
    network?: string;
    params?: object;
  }
  
  export interface Filters {
    defaultTab?: string;
    minScore?: number;
    onlyMembers?: boolean;
    invalids?: string[];
  }
  
  export interface Validation {
    name?: string;
    params?: object;
  }
  
  export interface Voting {
    delay?: number;
    period?: number;
    type?: string;
    quorum?: number;
    blind?: boolean;
    hideAbstain?: boolean;
  }
  
  export enum Categories {
    protocol = 'protocol',
    social = 'social',
    investment = 'investment',
    grant = 'grant',
    service = 'service',
    media = 'media',
    creator = 'creator',
    collector = 'collector'
  }
  
  export interface Space {
    name: string;
    network: string;
    symbol: string;
    strategies: Strategy[];
    private?: boolean;
    about?: string;
    guidelines?: string;
    terms?: string;
    avatar?: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    email?: string;
    skin?: string;
    domain?: string;
    members?: string[];
    admins?: string[];
    filters?: Filters;
    validation?: Validation;
    plugins?: object;
    voting?: Voting;
    categories?: Categories[];
  }
  
  
  // Onboarding Flags
  export enum Onboarding {
    Ready,
    NotFound,
    NotOwner,
    NeedsTextRecord, // needs a Text Record attached to ENS w/ 'snapshot' field
    NeedsENS, // needs an ENS domain
    NeedsIPFS, // needs IPFS URI to Space config
    NeedsValidSpaceConfigArg, // needs valid space config in argument
    NeedsValidSpaceURLArg, // needs valid space config in argument
    NeedsValidSpaceIPFS, // needs valid space config at IPFS URI
  };
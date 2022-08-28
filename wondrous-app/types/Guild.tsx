interface Admin {
  id: number;
  address: string;
  isOwner: boolean;
}

interface Theme {
  mode: string;
  color: string;
  backgroundImage?: any;
  backgroundCss?: any;
}

interface PlatformGuildData {
  joinButton: boolean;
  inviteChannel: string;
}

interface GuildPlatform {
  id: number;
  platformId: number;
  platformGuildId: string;
  platformGuildData: PlatformGuildData;
  platformGuildName: string;
  invite: string;
}

interface Data {}

interface Requirement {
  id: number;
  data: Data;
  name: string;
  type: string;
  chain: string;
  roleId: number;
  symbol: string;
  address?: any;
}

interface PlatformRoleData {
  gatedChannels: string;
}

interface RolePlatform {
  platformRoleId: string;
  guildPlatformId: number;
  platformRoleData: PlatformRoleData;
}

interface Role {
  id: number;
  name: string;
  logic: string;
  members: string[];
  imageUrl: string;
  description?: any;
  memberCount: number;
  requirements: Requirement[];
  rolePlatforms: RolePlatform[];
}

export interface Guild {
  id: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  showMembers: boolean;
  hideFromExplorer: boolean;
  createdAt: Date;
  onboardingComplete: boolean;
  admins: Admin[];
  theme: Theme;
  poaps: any[];
  guildPlatforms: GuildPlatform[];
  roles: Role[];
}

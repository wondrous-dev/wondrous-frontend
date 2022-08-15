import {
  MissionControlWorkspaceCardWrapper,
  WorkspaceCardContainer,
  WorkspaceCardBannerContainer,
  WorkspaceCardBannerImage,
  WorkspaceCardBannerLabel,
  WorkspaceCardStatsContainer,
  WorkspaceCardStat,
  WorkspaceCardStatCount,
  WorkspaceCardStatLabel,
} from './styles';

const MissionControlWorkspaceCard: React.FC<{ label: string; labelGradient: string; img: string; stats: any[] }> = ({
  label,
  labelGradient,
  img,
  stats,
}) => (
  <MissionControlWorkspaceCardWrapper>
    <WorkspaceCardContainer>
      <WorkspaceCardBannerContainer>
        <WorkspaceCardBannerImage src={img} />
        <WorkspaceCardBannerLabel gradient={labelGradient}>{label}</WorkspaceCardBannerLabel>
      </WorkspaceCardBannerContainer>
      <WorkspaceCardStatsContainer>
        {stats.map((stat, idx) => (
          <WorkspaceCardStat key={idx}>
            <stat.icon />
            <WorkspaceCardStatCount gradient={stat.countGradient}>{stat.count}</WorkspaceCardStatCount>
            <WorkspaceCardStatLabel>{stat.label}</WorkspaceCardStatLabel>
          </WorkspaceCardStat>
        ))}
      </WorkspaceCardStatsContainer>
    </WorkspaceCardContainer>
  </MissionControlWorkspaceCardWrapper>
);

export default MissionControlWorkspaceCard;

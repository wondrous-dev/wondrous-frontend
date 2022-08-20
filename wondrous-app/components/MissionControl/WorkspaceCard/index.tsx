import Link from 'next/link';
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
  WorkspaceCardLabelWrapper,
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
        <WorkspaceCardLabelWrapper>
          <WorkspaceCardBannerLabel gradient={labelGradient}>{label}</WorkspaceCardBannerLabel>
        </WorkspaceCardLabelWrapper>
      </WorkspaceCardBannerContainer>
      <WorkspaceCardStatsContainer>
        {stats.map((stat, idx) => (
          <Link href={stat.url} key={idx}>
            <WorkspaceCardStat>
              <stat.icon />
              <WorkspaceCardStatCount gradient={stat.countGradient}>{stat.count}</WorkspaceCardStatCount>
              <WorkspaceCardStatLabel>{stat.label}</WorkspaceCardStatLabel>
            </WorkspaceCardStat>
          </Link>
        ))}
      </WorkspaceCardStatsContainer>
    </WorkspaceCardContainer>
  </MissionControlWorkspaceCardWrapper>
);

export default MissionControlWorkspaceCard;

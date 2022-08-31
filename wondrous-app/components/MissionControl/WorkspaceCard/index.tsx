import Link from 'next/link';
import { RequestApproveButton } from 'components/organization/members/styles';
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

const MissionControlWorkspaceCard: React.FC<{
  label: string;
  labelGradient: string;
  img: string;
  stats: any[];
  hoverImg: string;
  gradient: string;
  url: string;
}> = ({ label, labelGradient, img, stats, hoverImg, gradient, url }) => (
  <MissionControlWorkspaceCardWrapper hoverImg={hoverImg} gradient={gradient}>
    <WorkspaceCardContainer>
      <WorkspaceCardBannerContainer>
        <WorkspaceCardBannerImage src={img}>
          <img src={img} />
        </WorkspaceCardBannerImage>
        <WorkspaceCardLabelWrapper>
          <Link href={url}>
            <WorkspaceCardBannerLabel gradient={labelGradient}>{label}</WorkspaceCardBannerLabel>
          </Link>
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

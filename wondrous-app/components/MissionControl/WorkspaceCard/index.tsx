import Link from 'next/link';
import { RequestApproveButton } from 'components/organization/members/styles';
import { useHotkey } from 'utils/hooks';
import { Badge } from '@mui/material';
import { HOTKEYS } from 'utils/hotkeyHelper';
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
}> = ({ label, labelGradient, img, stats, hoverImg, gradient, url }) => {
  const showBadge = useHotkey();

  return (
    <MissionControlWorkspaceCardWrapper hoverImg={hoverImg} gradient={gradient}>
      <Badge badgeContent={HOTKEYS.OPEN_DASHBOARD} color="primary" invisible={!showBadge}>
        <WorkspaceCardContainer>
          <Link href={url} shallow>
            <WorkspaceCardBannerContainer>
              <WorkspaceCardBannerImage src={img}>
                <img src={img} />
              </WorkspaceCardBannerImage>
              <WorkspaceCardLabelWrapper>
                <WorkspaceCardBannerLabel gradient={labelGradient}>{label}</WorkspaceCardBannerLabel>
              </WorkspaceCardLabelWrapper>
            </WorkspaceCardBannerContainer>
          </Link>
          <WorkspaceCardStatsContainer>
            {stats.map((stat, idx) => (
              <Link href={stat.url} key={idx} shallow>
                <WorkspaceCardStat>
                  <stat.icon />
                  <WorkspaceCardStatCount gradient={stat.countGradient}>{stat.count}</WorkspaceCardStatCount>
                  <WorkspaceCardStatLabel>{stat.label}</WorkspaceCardStatLabel>
                </WorkspaceCardStat>
              </Link>
            ))}
          </WorkspaceCardStatsContainer>
        </WorkspaceCardContainer>
      </Badge>
    </MissionControlWorkspaceCardWrapper>
  );
};

export default MissionControlWorkspaceCard;

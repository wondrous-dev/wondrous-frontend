import { useEffect, useState } from 'react';
import GrantsFilters, { GRANTS_ICONS_LABELS_MAP } from 'components/GrantsFilters';
import { GRANTS_STATUSES } from 'utils/constants';
import {
  BoardsCardBody,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardFooter,
  BoardsCardMedia,
  CardsContainer,
} from 'components/Common/Boards/styles';
import Grid from '@mui/material/Grid';
import { formatDateDisplay } from 'utils/board';
import { CompensationPill } from 'components/Common/Compensation/styles';
import { IconWrapper } from 'components/GrantsFilters/styles';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { RichTextViewer } from 'components/RichText';
import { SafeImage } from 'components/Common/Image';
import bounty from 'components/Icons/TaskTypes/bounty';
import CommentsIcon from 'components/Icons/comments';
import { DueDateIcon } from 'components/Icons/taskModalIcons';
import ViewGrant from 'components/ViewGrant';
import { useLocation } from 'utils/useLocation';
import { useRouter } from 'next/router';
import { delQuery } from 'utils/index';
import { GrantAmount } from 'components/ViewGrant/Fields';
import { BoardWrapper, EndingSoonPill, ItemPill } from './styles';
import { GET_ORG_GRANTS } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { useBoards, useOrgBoard, usePodBoard } from 'utils/hooks';
import { LIMIT } from 'services/board';

const GrantsBoard = () => {
  const [activeFilter, setActiveFilter] = useState(GRANTS_STATUSES.OPEN);

  const orgBoard = useOrgBoard()

  const {data} = useQuery(GET_ORG_GRANTS, {
    variables: { 
      orgId: orgBoard?.orgId,
      limit: LIMIT,
      offset: 0
     },
    skip: !orgBoard?.orgId
  })

  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleCardClick = (grant, query = '') => {
    let newUrl = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    if (query) {
      newUrl += query;
    }
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  useEffect(() => {
    const { params } = location;
    if (params.grant) {
      setOpenModal(true);
    }
  }, [location]);

  const handleModalClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[2]));
    }
    const newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  return (
    <>
      <ViewGrant open={openModal} handleClose={handleModalClose} grantId={location?.params?.grant} />
      <GrantsFilters onFilterChange={setActiveFilter} activeFilter={activeFilter} />
      <CardsContainer numberOfColumns={2} isFullWidth={false}>
        {data?.getGrantOrgBoard?.map((grant, idx) => {
          const { label, icon: Icon } = GRANTS_ICONS_LABELS_MAP[grant.status];
  const coverMedia = grant?.media?.find((media) => media.type === 'image');
          return (
            <BoardWrapper key={idx} onClick={() => handleCardClick(grant)}>
              <Grid justifyContent="space-between" alignItems="center" container>
                <Grid>
                  <GrantAmount grantAmount={grant.reward} numOfGrant={grant.numOfGrant}/>
                </Grid>
                <Grid display="flex" gap="14px">
                  <ItemPill key={idx} as="div">
                    <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                      {grant.applicationsNum} Applications
                    </Typography>
                  </ItemPill>

                  <ItemPill key={idx} as="div">
                    <IconWrapper>
                      <Icon />
                    </IconWrapper>
                    <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                      {label}
                    </Typography>
                  </ItemPill>
                </Grid>
              </Grid>
              <BoardsCardBody>
                <BoardsCardBodyTitle>{grant.title}</BoardsCardBodyTitle>
                <BoardsCardBodyDescription>
                  <RichTextViewer text={grant.description} />
                </BoardsCardBodyDescription>
                {coverMedia ? (
            <BoardsCardMedia>
            <SafeImage
              width={270}
              objectFit="cover"
              objectPosition="center"
              height="100%"
              layout="responsive"
              src={coverMedia.slug}
              useNextImage
            />
          </BoardsCardMedia>
              ) : null}
              </BoardsCardBody>
              <BoardsCardFooter>
                <EndingSoonPill>
                  <DueDateIcon />
                  <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                    Ending {formatDateDisplay(grant.endDate)}
                  </Typography>
                </EndingSoonPill>
                <Grid item container gap="10px" width="fit-content" lineHeight="0" alignItems="center">
                  {' '}
                  <CommentsIcon />
                  {grant.comments || 0}
                </Grid>
              </BoardsCardFooter>
            </BoardWrapper>
          );
        })}
      </CardsContainer>
    </>
  );
};

export default GrantsBoard;

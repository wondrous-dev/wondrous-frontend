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
import { BountyCommentsIcon } from 'components/Common/BountyBoard/styles';
import CommentsIcon from 'components/Icons/comments';
import { DueDateIcon } from 'components/Icons/taskModalIcons';
import ViewGrant from 'components/ViewGrant';
import { useLocation } from 'utils/useLocation';
import { useRouter } from 'next/router';
import { delQuery } from 'utils/index';
import { GrantAmount } from 'components/ViewGrant/Fields';
import { BoardWrapper, EndingSoonPill, ItemPill } from './styles';

const GrantsBoard = () => {
  const MOCK_DATA = [
    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      id: 1,
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      img: 'https://images.unsplash.com/photo-1661961110372-8a7682543120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    {
      title: 'This is the name of the grant',
      id: 2,
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      id: 3,
      description: 'Aliquet varius scelerisque tempor sodales aliquet nisl',
      applicationsNum: 15,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      id: 4,
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      img: 'https://images.unsplash.com/photo-1661961110372-8a7682543120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      id: 5,
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      img: 'https://images.unsplash.com/photo-1661961110372-8a7682543120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      id: 6,
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      id: 7,
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      grantAmount: {
        paymentMethodId: '56545357864108041',
        rewardAmount: '20',
        amount: '6',
        chain: 'ethereum',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
        tokenName: 'eth',
        symbol: 'eth',
      },

      img: 'https://images.unsplash.com/photo-1661961110372-8a7682543120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
  ];

  const [activeFilter, setActiveFilter] = useState(GRANTS_STATUSES.ACTIVE);

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
        {MOCK_DATA.map((grant, idx) => {
          const { label, icon: Icon } = GRANTS_ICONS_LABELS_MAP[grant.status];
          return (
            <BoardWrapper key={idx} onClick={() => handleCardClick(grant)}>
              <Grid justifyContent="space-between" alignItems="center" container>
                <Grid>
                  <GrantAmount grantAmount={grant.grantAmount} />
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
                {grant.img ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      src={grant.img}
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
                <BountyCommentsIcon>
                  <CommentsIcon />
                  {grant.comments || 0}
                </BountyCommentsIcon>
              </BoardsCardFooter>
            </BoardWrapper>
          );
        })}
      </CardsContainer>
    </>
  );
};

export default GrantsBoard;

import { useState } from 'react';
import GrantsFilters from 'components/GrantsFilters';
import { GRANTS_FILTERS } from 'services/board';
import { CardsContainer } from 'components/Common/Boards/styles';
import Grid from '@mui/material/Grid';
import { CompensationPill } from 'components/Common/Compensation/styles';
import { BoardWrapper } from './styles';

const GrantsBoard = () => {
  const MOCK_DATA = [
    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      img: 'https://storage.googleapis.com/wondrous-media-prod/task/71724136798355504/zopjq2n9QtCkuA.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcs-admin%40wondrous-1587456307075.iam.gserviceaccount.com%2F20221102%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221102T232735Z&X-Goog-Expires=7200&X-Goog-SignedHeaders=host&X-Goog-Signature=138ba57ce353404f8c20528fbd0f9ae2bcc26f42506eb8cc649f557e8d636cefdf52a958e095b8beba1901288ecdd9043bab22e8480bfdb9e1814eb5aeed19752e1a8d91e4644d7ded7b3e717bb94a0d81acf6f030d1339eaaab438b20043d7666050a44387f5566ef3b222c5d36e222b93bfc8c846a5d7894a8c2e020f2367cd9dceba10b8e16a5e6e892d793d7ab7817025f68dd48c018fa5d11aee12d23878fcacc5f1d7faf4d79e04cd1105769ebe1ae24c228863c5c0bec2c1fb5f89b7872e9bc92269f342f624a46a269e4d73ccb991306106760686ee790d37f14bbe224f76593319e55e97c3e54f0c672df9f2e12d12b16e7ea7eb0918ed5bda5a52e',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      description: 'Aliquet varius scelerisque tempor sodales aliquet nisl',
      applicationsNum: 15,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      img: 'https://storage.googleapis.com/wondrous-media-prod/task/71724136798355504/zopjq2n9QtCkuA.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcs-admin%40wondrous-1587456307075.iam.gserviceaccount.com%2F20221102%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221102T232735Z&X-Goog-Expires=7200&X-Goog-SignedHeaders=host&X-Goog-Signature=138ba57ce353404f8c20528fbd0f9ae2bcc26f42506eb8cc649f557e8d636cefdf52a958e095b8beba1901288ecdd9043bab22e8480bfdb9e1814eb5aeed19752e1a8d91e4644d7ded7b3e717bb94a0d81acf6f030d1339eaaab438b20043d7666050a44387f5566ef3b222c5d36e222b93bfc8c846a5d7894a8c2e020f2367cd9dceba10b8e16a5e6e892d793d7ab7817025f68dd48c018fa5d11aee12d23878fcacc5f1d7faf4d79e04cd1105769ebe1ae24c228863c5c0bec2c1fb5f89b7872e9bc92269f342f624a46a269e4d73ccb991306106760686ee790d37f14bbe224f76593319e55e97c3e54f0c672df9f2e12d12b16e7ea7eb0918ed5bda5a52e',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      img: 'https://storage.googleapis.com/wondrous-media-prod/task/71724136798355504/zopjq2n9QtCkuA.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcs-admin%40wondrous-1587456307075.iam.gserviceaccount.com%2F20221102%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221102T232735Z&X-Goog-Expires=7200&X-Goog-SignedHeaders=host&X-Goog-Signature=138ba57ce353404f8c20528fbd0f9ae2bcc26f42506eb8cc649f557e8d636cefdf52a958e095b8beba1901288ecdd9043bab22e8480bfdb9e1814eb5aeed19752e1a8d91e4644d7ded7b3e717bb94a0d81acf6f030d1339eaaab438b20043d7666050a44387f5566ef3b222c5d36e222b93bfc8c846a5d7894a8c2e020f2367cd9dceba10b8e16a5e6e892d793d7ab7817025f68dd48c018fa5d11aee12d23878fcacc5f1d7faf4d79e04cd1105769ebe1ae24c228863c5c0bec2c1fb5f89b7872e9bc92269f342f624a46a269e4d73ccb991306106760686ee790d37f14bbe224f76593319e55e97c3e54f0c672df9f2e12d12b16e7ea7eb0918ed5bda5a52e',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },

    {
      title: 'This is the name of the grant',
      description:
        'Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar. Aliquet varius scelerisque tempor sodales aliquet nisl, ut auctor bibendum. Vitae in lectus tortor lacus blandit sem. Justo, conse quat faucibus hendrerit nisl, at erat iaculis nisl sagittis. Pulv inar',
      applicationsNum: 20,
      status: 'active',
      rewards: [
        {
          rewardAmount: 20,
          symbol: 'ETH',
          chain: 'Ethereum',
          icon: '',
        },
      ],
      img: 'https://storage.googleapis.com/wondrous-media-prod/task/71724136798355504/zopjq2n9QtCkuA.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcs-admin%40wondrous-1587456307075.iam.gserviceaccount.com%2F20221102%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221102T232735Z&X-Goog-Expires=7200&X-Goog-SignedHeaders=host&X-Goog-Signature=138ba57ce353404f8c20528fbd0f9ae2bcc26f42506eb8cc649f557e8d636cefdf52a958e095b8beba1901288ecdd9043bab22e8480bfdb9e1814eb5aeed19752e1a8d91e4644d7ded7b3e717bb94a0d81acf6f030d1339eaaab438b20043d7666050a44387f5566ef3b222c5d36e222b93bfc8c846a5d7894a8c2e020f2367cd9dceba10b8e16a5e6e892d793d7ab7817025f68dd48c018fa5d11aee12d23878fcacc5f1d7faf4d79e04cd1105769ebe1ae24c228863c5c0bec2c1fb5f89b7872e9bc92269f342f624a46a269e4d73ccb991306106760686ee790d37f14bbe224f76593319e55e97c3e54f0c672df9f2e12d12b16e7ea7eb0918ed5bda5a52e',
      comments: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
  ];

  const [activeFilter, setActiveFilter] = useState(GRANTS_FILTERS[0].value);
  return (
    <>
      <GrantsFilters onFilterChange={setActiveFilter} activeFilter={activeFilter} />
      <CardsContainer numberOfColumns={3} isFullWidth={false}>
        {MOCK_DATA.map((grant) => (
          <BoardWrapper>
            <Grid justifyContent="space-between" alignItems="center" container>
              <Grid>5 ETH</Grid>
              <Grid display="flex" gap="14px">
                {/* {grant.applicationsNum} */}
                <CompensationPill>{grant.applicationsNum}</CompensationPill>
                <CompensationPill>{grant.status}</CompensationPill>
              </Grid>
            </Grid>
          </BoardWrapper>
        ))}
      </CardsContainer>
    </>
  );
};

export default GrantsBoard;

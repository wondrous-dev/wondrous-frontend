import PageHeader from 'components/PageHeader';
import { MenuSwitcher, OrgDetails } from 'components/Settings';
import PageWrapper from 'components/Shared/PageWrapper';
import { BG_TYPES } from 'utils/constants';

const SettingsPage = () => {
  return (
    <>
      <PageHeader title='Settings' />
      <PageWrapper
        bgType={BG_TYPES.DEFAULT}
        containerProps={{
          direction: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minHeight: '100vh',
          gap: '24px',
          padding: {
            xs: '14px 14px 120px 14px',
            sm: '24px 56px 150px 24px',
          },
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        <MenuSwitcher />
        <OrgDetails />
      </PageWrapper>
    </>
  );
};

export default SettingsPage;

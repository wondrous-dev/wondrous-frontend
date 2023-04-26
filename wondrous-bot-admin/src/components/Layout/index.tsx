import { useQuery } from '@apollo/client';
import Navbar from 'components/Navbar';
import PageSpinner from 'components/PageSpinner';
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from 'graphql/queries';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { useLocation } from 'react-router-dom';
import { PAGES_WITHOUT_HEADER } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';
import { Main } from './styles';

const Layout = () => {
  const location = useLocation();
  const [activeOrg, setActiveOrg] = useState(null);

  const isPageWithoutHeader = PAGES_WITHOUT_HEADER.includes(location.pathname);

  const { data: userOrgs, loading } = useQuery(
    GET_LOGGED_IN_USER_FULL_ACCESS_ORGS,
    {
      skip: isPageWithoutHeader,
      notifyOnNetworkStatusChange: true,
      variables: {
        excludeSharedOrgs: true,
      },
      onCompleted: ({ getLoggedInUserFullAccessOrgs }) => {
        setActiveOrg(getLoggedInUserFullAccessOrgs[0]);
      },
    }
  );

  console.log(userOrgs, 'userOrgs')
  if (loading) {
    return <PageSpinner />;
  }
  return (
    <GlobalContext.Provider
      value={{
        activeOrg,
        setActiveOrg,
        userOrgs: userOrgs?.getLoggedInUserFullAccessOrgs || [],
      }}
    >
      {isPageWithoutHeader ? null : <Navbar />}
      <Main $isPageWithoutHeader={isPageWithoutHeader}>
        <Outlet />
      </Main>
    </GlobalContext.Provider>
  );
};

export default Layout;

import React, { useState } from 'react';
import Image from 'next/image';

import { SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';
import { toggleHtmlOverflow } from '../../../utils/helpers';
import CreateFormModal from '../../CreateEntity';
import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import { Banner, Content, ContentContainer, OverviewComponent } from './styles';

const Wrapper = (props) => {
  const { children } = props;
  const [minimized, setMinimized] = useState(false);
  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <Header openCreateFormModal={toggleCreateFormModal} />
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <SideBarComponent />
        <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <OverviewComponent
          style={{
            paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
          }}
        >
          <Banner>
            <Image alt="Dashboard" src="/images/dashboard-banner.png" layout="fill" objectFit="cover" quality={80} />
          </Banner>
          <Content>
            <ContentContainer>{children}</ContentContainer>
          </Content>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default Wrapper;

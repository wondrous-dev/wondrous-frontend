import React, { useState } from 'react';
import Image from 'next/image';

import { SIDEBAR_WIDTH } from 'utils/constants';
import useSideBar from 'hooks/useSideBar';
import { toggleHtmlOverflow } from 'utils/helpers';
import ChooseEntityToCreate from '../../CreateEntity';
import HeaderComponent from '../../Header';
import SideBarComponent from '../../SideBar';
import CreateFormModal from '../../CreateEntity';
import { Banner, Content, ContentContainer, OverviewComponent } from './styles';

const Wrapper = (props) => {
  const { children } = props;
  const { minimized } = useSideBar();

  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <HeaderComponent openCreateFormModal={toggleCreateFormModal} />

      <SideBarComponent />
      <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
      <OverviewComponent
        style={{
          paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
        }}
      >
        <ChooseEntityToCreate open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <Banner>
          <Image alt="Dashboard" src="/images/dashboard-banner.png" layout="fill" objectFit="cover" quality={80} />
        </Banner>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;

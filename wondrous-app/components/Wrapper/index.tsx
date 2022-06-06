import Header from '../Header';
import SideBarComponent from '../SideBar';
import { Content, ContentContainer, OverviewComponent } from './styles';

const Wrapper = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <SideBarComponent />
      <OverviewComponent>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;

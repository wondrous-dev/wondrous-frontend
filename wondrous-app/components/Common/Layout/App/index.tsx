import { Main, Footer, Container } from './styles';

// TODO is this still used ?
function AppLayout({ banner, children, ...props }) {
  return (
    <>
      <Main>
        {banner}
        <Container style={props?.containerStyle}>{children}</Container>
      </Main>
      <Footer />
    </>
  );
}

export default AppLayout;

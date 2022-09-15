import styled from 'styled-components';
import palette from 'theme/palette';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 4px 8px;
  height: 32px;
  line-height: 32px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  ${(props) => (props.textAlign ? { textAlign: props.textAlign } : null)};

  cursor: pointer;

  :hover {
    background: ${palette.black98};
    border-radius: 4px;
  }
`;

export default Wrapper;

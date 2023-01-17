import { SubmissionItemWrapper } from 'components/Common/TaskSubmission/styles';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button } from 'components/ViewGrantApplication/Fields/styles';

export const RejectButton = (props) => (
  <Button gradient="linear-gradient(259.59deg, #F93701 0%, #7427FF 93.38%)" {...props} />
);
export const Footer = styled.div`
  background-color: ${palette.black97};
  border-radius: 6px;
  padding: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const ApplicationItemWrapper = styled(SubmissionItemWrapper)`
  && {
    padding: 0px;
  }
`;

export const ApplicationItemContainer = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

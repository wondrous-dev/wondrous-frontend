import { TaskModalCard, TaskModalHeaderBackToList } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityHeader,
  CreateEntityHeaderWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntitySelectErrorWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { deserializeRichText } from 'components/RichText';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTaskContext } from 'utils/hooks';
import { useMe } from 'components/Auth/withAuth';
import { Tooltip, Box } from '@mui/material';
import { Form } from 'components/CreateGrant/styles';
import { descriptionTemplate } from './utils';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  grantAmount: yup.object({
    amount: yup.number().required('Amount is required'),
  }),
  walletAddress: yup.string().required('Wallet address is required'),
  mediaUploads: yup.array(),
});

const CreateGrantApplication = () => {
  const user = useMe();
  const { isFullScreen, grantId, toggleCreateApplicationModal, toggleFullScreen } = useTaskContext();
  const initialValues = {
    title: null,
    description: deserializeRichText(descriptionTemplate),
    grantAmount: {
      amount: 0,
    },
    walletAddress: user?.activeEthAddress || null,
    mediaUploads: [],
  };

  const form = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Form onSubmit={form.handleSubmit}>
      <TaskModalCard fullScreen={isFullScreen} data-cy="modal-create-grant">
        <CreateEntityHeader>
          <CreateEntityHeaderWrapper>
            <CreateEntitySelectErrorWrapper>
              <TaskModalHeaderBackToList onClick={toggleCreateApplicationModal}>
                Back to grant
              </TaskModalHeaderBackToList>
            </CreateEntitySelectErrorWrapper>
            <CreateEntityHeaderWrapper>
              <Tooltip title="Full screen" placement="top">
                <Box>
                  <CreateEntityOpenInFullIcon onClick={toggleFullScreen} />
                </Box>
              </Tooltip>
            </CreateEntityHeaderWrapper>
          </CreateEntityHeaderWrapper>
        </CreateEntityHeader>
      </TaskModalCard>
    </Form>
  );
};

export default CreateGrantApplication;

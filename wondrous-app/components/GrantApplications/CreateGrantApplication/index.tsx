import { deserializeRichText } from 'components/RichText';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { descriptionTemplate } from './utils';

const validationSchema = yup.object({
  title: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  grantAmount: yup.object({
    amount: yup.number().required('Amount is required'),
  }),
  walletAddress: yup.string().required('Wallet address is required'),
  mediaUploads: yup.array(),
});

const CreateGrantApplication = () => {
  const initialValues = {
    title: '',
    description: deserializeRichText(descriptionTemplate),
    grantAmount: {
      amount: 0,
      walletAddress: '',
    },
    mediaUploads: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return null;
};

export default CreateGrantApplication;

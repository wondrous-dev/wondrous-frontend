import { useLazyQuery, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { CREATE_ORG_DOCUMENT } from 'graphql/mutations/documents';
import { GET_ORG_DOCS } from 'graphql/queries/documents';
import { URL_REGEX } from 'utils/constants';

import ImageUploader from 'components/ImageUploader';
import DocPermissionSelect from 'components/DocPermissionSelect';

import styles, { labelStyles, inputStyles, cancelStyles, addDocStyles } from './AddDocumentDialogStyles';

const LabelTypography = styled(Typography)(labelStyles);
const StyledTextField = styled(TextField)(inputStyles);
const CancelButton = styled(Button)(cancelStyles);
const AddDocButton = styled(Button)(addDocStyles);

const AddDocumentDialog = ({ open, onClose, title, orgId, category }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [getOrgDocs] = useLazyQuery(GET_ORG_DOCS, {
    variables: {
      orgId,
    },
  });

  const [createOrgDocument] = useMutation(CREATE_ORG_DOCUMENT, {
    onCompleted: () => {
      getOrgDocs();
    },
  });

  const onSubmit = (data) => {
    createOrgDocument({
      variables: {
        input: {
          pinned: category.value === SAMPLE_CATEGORIES.PINNED.value, // TODO: remove SAMPLE_CATEGORIES || When trying to set up pinned = true I'm always getting pinned false
          orgId: orgId,
          ...data,
        },
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
      sx={styles.white}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.titleIcon}>
          <Image src="/images/icons/addDoc.png" alt="folder icon" width={16} height={20} />
        </Box>
        Add a Doc to <Box sx={styles.category}> {title}</Box>
        <Box flex={1} />
        <Box onClick={onClose} sx={styles.closeButton}>
          <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 8 }}>
          <Box mb={3.5}>
            <LabelTypography>Link</LabelTypography>
            <StyledTextField
              name="link"
              placeholder="Enter here a valid link"
              {...register('link', {
                required: 'link is required',
                pattern: { value: URL_REGEX, message: 'Please enter a valid link' },
              })}
              fullWidth
              helperText={errors.link && errors.link.message}
              error={errors.link}
            />
          </Box>
          <Box mb={3.5}>
            <LabelTypography>Document title</LabelTypography>
            <StyledTextField
              name="title"
              placeholder="Enter title"
              {...register('title', {
                required: 'title is required',
              })}
              fullWidth
              helperText={errors.title && errors.title.message}
              error={errors.title}
            />
          </Box>
          <Box mb={3.5}>
            <LabelTypography>Document description</LabelTypography>
            <StyledTextField
              name="description"
              placeholder="Enter description"
              {...register('description', {
                required: 'description is required',
              })}
              fullWidth
              helperText={errors.docDescription && errors.docDescription.message}
              error={errors.docDescription}
            />
          </Box>

          <Box>
            <LabelTypography>Image preview</LabelTypography>
            <ImageUploader

            //TODO: right now we cant upload files to the server, only string urls, see graphql docs
            // register={register('file', {
            //   required: 'file is required',
            // })}
            // errors={errors}
            />
          </Box>

          {/* TODO: Add conditional to display DocPermissionSelect */}
          <Box sx={styles.separator}>
            <LabelTypography>Who can see this doc</LabelTypography>

            <DocPermissionSelect
              register={register('visibility', {
                required: 'visibility is required',
              })}
              errors={errors}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <AddDocButton type="submit">
            <Box>Add Doc</Box>
          </AddDocButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddDocumentDialog.propTypes = {};

export default AddDocumentDialog;

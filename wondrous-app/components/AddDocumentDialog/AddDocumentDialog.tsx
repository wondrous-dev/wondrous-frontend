import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { CREATE_ORG_DOCUMENT, CREATE_POD_DOCUMENT, UPDATE_DOCUMENT } from 'graphql/mutations/documents';
import { ENTITIES_TYPES, URL_REGEX } from 'utils/constants';

import DocModal from 'components/DocModal';
import ImageUploader from 'components/ImageUploader';
import DocPermissionSelect from 'components/DocPermissionSelect';

import styles, { labelStyles, inputStyles } from './AddDocumentDialogStyles';

const LabelTypography = styled(Typography)(labelStyles);
const StyledTextField = styled(TextField)(inputStyles);

function AddDocumentDialog({ open, onClose, title, orgId, podId, category, document, pinned }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const isEdit = !isEmpty(document);

  const handleClose = () => {
    reset();
    onClose();
  };

  const docRefetchQueries = ['getOrgDocs', 'getPodDocs'];

  const [createOrgDocument] = useMutation(CREATE_ORG_DOCUMENT, {
    refetchQueries: [docRefetchQueries[0]],
  });

  const [createPodDocument] = useMutation(CREATE_POD_DOCUMENT, {
    refetchQueries: [docRefetchQueries[1]],
  });

  const [updateDocument] = useMutation(UPDATE_DOCUMENT, {
    refetchQueries: docRefetchQueries,
  });

  const onSubmitForm = (data) => {
    if (isEdit) {
      updateDocument({
        variables: {
          documentId: document.id,
          input: {
            description: data.description,
            link: data.link,
            title: data.title,
            visibility: data.visibility,
            previewPicture: data.previewPicture,
          },
        },
      });

      handleClose();
      return;
    }
    if (podId) {
      createPodDocument({
        variables: {
          input: {
            ...data,
            orgId,
            podId,
            ...(category?.id && { categoryId: category.id }),
            ...(pinned && { pinned }),
          },
        },
      });
    } else {
      createOrgDocument({
        variables: {
          input: {
            ...data,
            orgId,
            ...(category?.id && { categoryId: category.id }),
            ...(pinned && { pinned }),
          },
        },
      });
    }
    handleClose();
  };

  useEffect(() => {
    reset({ ...document });
  }, [document]);

  return (
    <DocModal
      open={open}
      onClose={handleClose}
      title="Add a Doc to"
      highlightedText={title}
      titleIcon={<Image src="/images/icons/addDoc.png" alt="folder icon" width={16} height={20} />}
      onSubmit={handleSubmit(onSubmitForm)}
      submitLabel={isEdit ? 'Update Doc' : 'Add Doc'}
    >
      <form>
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
            helperText={errors.link?.message}
            error={Boolean(errors.link)}
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
            helperText={errors.title?.message}
            error={Boolean(errors.title)}
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
            helperText={errors.description?.message}
            error={Boolean(errors.description)}
          />
        </Box>

        <Box>
          <LabelTypography>Image preview</LabelTypography>
          <ImageUploader setValue={setValue} errors={errors} value={document.previewPicture} />
        </Box>

        {/* TODO: Add conditional to display DocPermissionSelect */}
        <Box sx={styles.separator}>
          <LabelTypography>Who can see this doc</LabelTypography>

          <DocPermissionSelect
            register={register('visibility', {
              required: 'visibility is required',
            })}
            errors={errors}
            defaultValue={document.visibility}
          />
        </Box>
      </form>
    </DocModal>
  );
}

export default AddDocumentDialog;

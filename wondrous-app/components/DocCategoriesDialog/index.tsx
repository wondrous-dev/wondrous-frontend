import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import {
  CREATE_ORG_DOCUMENT_CATEGORY,
  DELETE_ORG_DOCUMENT_CATEGORY,
  UPDATE_ORG_DOCUMENT_CATEGORY,
} from 'graphql/mutations/documents';

import DocPermissionSelect from 'components/DocPermissionSelect';
import DocModal from 'components/DocModal';

import { labelStyles, inputStyles } from './DocCategoriesDialogStyles';

const LabelTypography = styled(Typography)(labelStyles);
const StyledTextField = styled(TextField)(inputStyles);

const DocCategoriesDialog = ({ open, onClose, orgName, orgId, category }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const [createOrgDocumentCategory] = useMutation(CREATE_ORG_DOCUMENT_CATEGORY, {
    refetchQueries: ['getOrgDocumentCategories'],
  });

  const [deleteDocumentCategory] = useMutation(DELETE_ORG_DOCUMENT_CATEGORY, {
    refetchQueries: ['getOrgDocumentCategories'],
  });

  const [updateDocumentCategory] = useMutation(UPDATE_ORG_DOCUMENT_CATEGORY, {
    refetchQueries: ['getOrgDocumentCategories'],
  });

  const handleDelete = () => {
    deleteDocumentCategory({
      variables: {
        documentCategoryId: category.id,
      },
    });
    handleClose();
  };

  const onSubmitForm = (data) => {
    if (isEdit) {
      updateDocumentCategory({
        variables: {
          documentCategoryId: category.id,
          input: {
            name: data.name,
          },
        },
      });
      handleClose();
      return;
    }

    createOrgDocumentCategory({
      variables: {
        input: {
          orgId: orgId,
          name: data.name,
        },
      },
    });
    handleClose();
  };

  const isEdit = !isEmpty(category);

  useEffect(() => {
    reset({ ...category });
  }, [category]);

  return (
    <DocModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Doc category in ' : 'Create a new Doc Category to '}
      highlightedText={orgName}
      onSubmit={handleSubmit(onSubmitForm)}
      submitLabel={isEdit ? 'Save changes' : 'Create Category'}
      onDelete={handleDelete}
      deleteLabel="Delete Category"
      titleIcon={
        isEdit ? (
          <Image src="/images/icons/editFolder.png" alt="folder icon" width={18} height={14} />
        ) : (
          <Image src="/images/icons/addFolder.svg" alt="folder icon" width={20} height={22} />
        )
      }
    >
      <form>
        <Box mb={3.5}>
          <LabelTypography>Category name</LabelTypography>
          <StyledTextField
            placeholder="Enter name"
            {...register('name', {
              required: 'name is required',
            })}
            fullWidth
            helperText={errors.name?.message}
            error={errors.name}
          />
        </Box>

        <Box mb={3.5}>
          <LabelTypography>Who can see this category</LabelTypography>
          {/* // TODO: Permission not included on documentCategoryInput at the BE */}
          <DocPermissionSelect
            register={register('visibility', {
              required: 'visibility is required',
            })}
            errors={errors}
          />
        </Box>
      </form>
    </DocModal>
  );
};

export default DocCategoriesDialog;

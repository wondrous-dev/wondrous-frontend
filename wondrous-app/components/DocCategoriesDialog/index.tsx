import { useEffect } from 'react';
import head from 'lodash/head';
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
  CREATE_POD_DOCUMENT_CATEGORY,
  DELETE_DOCUMENT_CATEGORY,
  UPDATE_DOCUMENT_CATEGORY,
} from 'graphql/mutations/documents';
import { DOCS_PERMISSIONS } from 'utils/constants';

import DocPermissionSelect from 'components/DocPermissionSelect';
import DocModal from 'components/DocModal';

import { GET_POD_DOCS_CATEGORIES } from 'graphql/queries/documents';
import { labelStyles, inputStyles } from './DocCategoriesDialogStyles';

const LabelTypography = styled(Typography)(labelStyles);
const StyledTextField = styled(TextField)(inputStyles);

function DocCategoriesDialog({ open, onClose, orgName, orgId, podId, category }) {
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

  const [createPodDocumentCategory] = useMutation(CREATE_POD_DOCUMENT_CATEGORY, {
    refetchQueries: [GET_POD_DOCS_CATEGORIES],
  });

  const [deleteDocumentCategory] = useMutation(DELETE_DOCUMENT_CATEGORY, {
    refetchQueries: ['getOrgDocumentCategories', GET_POD_DOCS_CATEGORIES],
  });

  const [updateDocumentCategory] = useMutation(UPDATE_DOCUMENT_CATEGORY, {
    refetchQueries: ['getOrgDocumentCategories', GET_POD_DOCS_CATEGORIES],
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
    if (podId) {
      createPodDocumentCategory({
        variables: {
          input: {
            orgId,
            podId,
            name: data.name,
          },
        },
      });
    } else {
      createOrgDocumentCategory({
        variables: {
          input: {
            orgId,
            name: data.name,
          },
        },
      });
    }
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
            error={Boolean(errors.name)}
          />
        </Box>

        <Box mb={3.5}>
          <LabelTypography>Who can see this category</LabelTypography>
          {/* // TODO: Permission not included on documentCategoryInput at the BE */}
          <DocPermissionSelect
            register={register('visibility', {
              required: 'visibility is required',
            })}
            defaultValue={head(DOCS_PERMISSIONS).value}
            errors={errors}
          />
        </Box>
      </form>
    </DocModal>
  );
}

export default DocCategoriesDialog;

import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_POD_DOCS, GET_POD_DOCS_CATEGORIES } from 'graphql/queries/documents';
import Image from 'next/image';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';

import Tooltip from 'components/Tooltip';

import DocItemsMenu from 'components/DocItemsMenu';
import DeleteDocDialog from 'components/DeleteDocDialog';

import AddDocumentDialog from 'components/AddDocumentDialog';
import PinnedDocsSection from 'components/PinnedDocsSection';
import DocCategoriesSection from 'components/DocCategoriesSection';
import DocCategoriesDialog from 'components/DocCategoriesDialog';

import Wrapper from '../wrapper';
import styles from 'components/organization/docs/docsStyles';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { PERMISSIONS } from 'utils/constants';

const useGetPodDocs = (podId) => {
  const [getPodDocs, { data: docData, loading: loadingDocs }] = useLazyQuery(GET_POD_DOCS, {
    variables: {
      podId,
    },
  });

  const [getPodDocsCategories, { data: categoriesData, loading: loadingCategories }] = useLazyQuery(
    GET_POD_DOCS_CATEGORIES,
    {
      variables: {
        podId,
      },
    }
  );

  const loading = loadingDocs || loadingCategories;

  useEffect(() => {
    if (!docData && podId) {
      getPodDocs();
    }
  }, [loadingDocs, podId, getPodDocs, docData]);

  useEffect(() => {
    if (!categoriesData && podId) {
      getPodDocsCategories();
    }
  }, [loadingCategories, podId, getPodDocsCategories, categoriesData]);

  return {
    docData: docData?.getPodDocuments,
    categoriesData: categoriesData?.getPodDocumentCategories,
    loading,
  };
};

const Docs = (props) => {
  const { podData = {} } = props;
  const { id: podId } = podData;
  const router = useRouter();

  const { docData, categoriesData } = useGetPodDocs(podId);
  const [showDocDialog, setDocShowDialog] = useState(false);
  const [showDeleteDocDialog, setDeleteDocDialog] = useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [docCategory, setDocCategory] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [pinned, setPinned] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const openMenu = Boolean(menuAnchor);

  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: podData?.orgId,
    podId,
  });
  const canEdit = permissions.includes(PERMISSIONS.FULL_ACCESS);

  const handleItemClick = (event, doc) => {
    // Don't show menu if link is clicked
    if (!event.target.href && canEdit) {
      setMenuAnchor(event.currentTarget);
      setSelectedDoc(doc);
    }
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedDoc({});
  };

  const handleOpenDocDialog = (category) => {
    setDocShowDialog(true);
    setDocCategory(category);
    setSelectedDoc({});
  };

  const handleOpenDocDialogPinned = () => {
    setDocShowDialog(true);
    setPinned(true);
    setSelectedDoc({});
  };

  const handleOpenEditDocDialog = () => {
    if (canEdit) {
      setDocShowDialog(true);
    }
  };

  const handleCloseDocDialog = () => {
    setDocShowDialog(false);
    setDocCategory({});
    setPinned(false);
    handleMenuClose();
  };

  const handleOpenCategoriesDialog = (category) => {
    setShowCategoriesDialog(true);
    setDocCategory(category);
  };

  const handleCloseCategoriesDialog = () => {
    setShowCategoriesDialog(false);
    setDocCategory({});
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDocDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDocDialog(false);
    handleCloseDocDialog();
  };

  const pinnedDocs = docData?.filter((doc) => doc.pinned);

  return (
    <Wrapper>
      {canEdit && (
        <Tooltip title="Create new doc category" placement="top">
          <Box sx={styles.categoryButtonContainer}>
            <Box sx={styles.categoryButton} onClick={() => setShowCategoriesDialog(true)}>
              <Image src="/images/icons/plus.svg" alt="plus icon" width={16} height={16} />
            </Box>
          </Box>
        </Tooltip>
      )}

      {!isEmpty(pinnedDocs) && (
        <PinnedDocsSection
          onDialogOpen={handleOpenDocDialogPinned}
          pinnedDocs={pinnedDocs}
          onItemClick={handleItemClick}
        />
      )}

      {categoriesData?.map((category) => (
        <DocCategoriesSection
          key={category.id}
          category={category}
          onItemClick={handleItemClick}
          onOpenDocDialog={handleOpenDocDialog}
          onCategoryDialogOpen={handleOpenCategoriesDialog}
          docs={docData}
          canEdit={canEdit}
        />
      ))}

      <DocItemsMenu
        open={openMenu}
        anchorEl={menuAnchor}
        onClose={handleMenuClose}
        onDelete={handleOpenDeleteDialog}
        onEdit={handleOpenEditDocDialog}
      />
      <AddDocumentDialog
        open={showDocDialog}
        onClose={handleCloseDocDialog}
        title={docCategory?.name}
        orgId={podData?.orgId}
        podId={podId}
        category={docCategory}
        document={selectedDoc}
        pinned={pinned}
      />
      <DocCategoriesDialog
        open={showCategoriesDialog}
        onClose={handleCloseCategoriesDialog}
        orgName={router.query.username}
        orgId={podData?.orgId}
        podId={podId}
        category={docCategory}
      />
      <DeleteDocDialog open={showDeleteDocDialog} onClose={handleCloseDeleteDialog} selectedDoc={selectedDoc} />
    </Wrapper>
  );
};

export default Docs;

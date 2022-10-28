import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_POD_DOCS, GET_POD_DOCS_CATEGORIES } from 'graphql/queries/documents';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';

import AddDocumentDialog from 'components/AddDocumentDialog';
import ResourcesSidebar from 'components/Common/SidebarResources';
import DeleteDocDialog from 'components/DeleteDocDialog';
import DocCategoriesDialog from 'components/DocCategoriesDialog';
import DocCategoriesSection from 'components/DocCategoriesSection';
import DocItemsMenu from 'components/DocItemsMenu';
import EmptyStateGeneric from 'components/EmptyStateGeneric';
import PinnedDocsSection from 'components/PinnedDocsSection';

import styles, { AddIconWrapper } from 'components/organization/docs/docsStyles';

import Wrapper from '../wrapper';

const useGetPodDocs = (podId) => {
  const [getPodDocs, { data: docData, loading: loadingDocs }] = useLazyQuery(GET_POD_DOCS, {
    variables: {
      podId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodDocsCategories, { data: categoriesData, loading: loadingCategories }] = useLazyQuery(
    GET_POD_DOCS_CATEGORIES,
    {
      variables: {
        podId,
      },
      fetchPolicy: 'network-only',
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

function Docs(props) {
  const { podData = {} } = props;
  const { id: podId } = podData;
  const router = useRouter();

  const { docData, categoriesData } = useGetPodDocs(podId);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const filteredCategories = selectedCategory
    ? categoriesData.filter((i) => i.id === selectedCategory)
    : categoriesData;

  const handleCreateNewCategory = () => setShowCategoriesDialog(true);
  const handleSelectCategory = (id) => () => setSelectedCategory(id);

  return (
    <ResourcesSidebar
      docs={categoriesData}
      handleCreateNewCategory={handleCreateNewCategory}
      handleSelectCategory={handleSelectCategory}
      selectedCategory={selectedCategory}
    >
      <Wrapper>
        {canEdit && (
          <Box sx={styles.topButtonsContainer}>
            <Button disableRipple sx={styles.addCategoryButton} onClick={handleCreateNewCategory}>
              <AddIconWrapper style={styles.addIcon} />
              Add new category
            </Button>
          </Box>
        )}

        {isEmpty(docData) && isEmpty(categoriesData) && (
          <EmptyStateGeneric
            content={`Welcome to the Documents page for ${podData?.name}. This is your knowledge hub - link high-signal documents to give context to your team members and community.`}
          />
        )}

        {!isEmpty(pinnedDocs) && (
          <PinnedDocsSection
            onDialogOpen={handleOpenDocDialogPinned}
            pinnedDocs={pinnedDocs}
            onItemClick={handleItemClick}
          />
        )}

        {filteredCategories?.map((category) => (
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
    </ResourcesSidebar>
  );
}

export default Docs;

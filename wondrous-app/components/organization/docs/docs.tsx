import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useLazyQuery, useQuery } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_DOCS, GET_ORG_DOCS_CATEGORIES } from 'graphql/queries/documents';
import { ANALYTIC_EVENTS, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';

import AddDocumentDialog from 'components/AddDocumentDialog';
import DeleteDocDialog from 'components/DeleteDocDialog';
import DocCategoriesDialog from 'components/DocCategoriesDialog';
import DocCategoriesSection from 'components/DocCategoriesSection';
import DocItemsMenu from 'components/DocItemsMenu';
import EmptyStateGeneric from 'components/EmptyStateGeneric';
import PinnedDocsSection from 'components/PinnedDocsSection';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import EntitySidebar from 'components/Common/SidebarEntity';
import { OrgBoardContext } from 'utils/contexts';

import Tooltip from 'components/Tooltip';

import { useMe } from 'components/Auth/withAuth';
import styles, { AddIconWrapper } from './docsStyles';

const useGetOrgDocs = (orgId) => {
  const [getOrgDocs, { data: docData, loading: loadingDocs }] = useLazyQuery(GET_ORG_DOCS, {
    variables: {
      orgId,
    },
  });

  const [getOrgDocsCategories, { data: categoriesData, loading: loadingCategories }] = useLazyQuery(
    GET_ORG_DOCS_CATEGORIES,
    {
      variables: {
        orgId,
      },
    }
  );

  const loading = loadingDocs || loadingCategories;

  useEffect(() => {
    if (!docData && orgId) {
      getOrgDocs();
    }
  }, [loadingDocs, orgId, getOrgDocs, docData]);

  useEffect(() => {
    if (!categoriesData && orgId) {
      getOrgDocsCategories();
    }
  }, [loadingCategories, orgId, getOrgDocsCategories, categoriesData]);

  return {
    docData: docData?.getOrgDocuments,
    categoriesData: categoriesData?.getOrgDocumentCategories,
    loading,
  };
};

function Docs(props) {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const router = useRouter();
  const { docData, categoriesData } = useGetOrgDocs(orgId);
  const [showDocDialog, setDocShowDialog] = useState(false);
  const [showDeleteDocDialog, setDeleteDocDialog] = useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [docCategory, setDocCategory] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [pinned, setPinned] = useState(false);

  const filteredCategories = categoriesData;
  const user = useMe();
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
    orgId,
  });
  const canEdit = permissions.includes(PERMISSIONS.FULL_ACCESS);

  const handleItemClick = (event, doc) => {
    // Don't show menu if link is clicked
    if (!event.target.href && canEdit) {
      setMenuAnchor(event.currentTarget);
      setSelectedDoc(doc);
    }
    if (window?.analytics && process.env.NEXT_PUBLIC_ENV === 'production') {
      window?.analytics?.track(ANALYTIC_EVENTS.DOCUMENT_CLICK, {
        docId: doc?.id,
        orgId,
        userId: user?.id,
      });
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

  const handleCreateNewCategory = () => setShowCategoriesDialog(true);

  const pinnedDocs = docData?.filter((doc) => doc.pinned);

  return (
    <OrgBoardContext.Provider
      value={{
        orgId: orgData?.id,
        orgData,
        userPermissionsContext,
      }}
    >
      <EntitySidebar>
        <BoardPageHeader orgData={orgData} headerTitle="Documents">
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
              content={`Welcome to the Documents page for ${orgData?.name}. This is your knowledge hub - link high-signal documents to give context to your team members and community.`}
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
            orgId={orgId}
            podId={null}
            category={docCategory}
            document={selectedDoc}
            pinned={pinned}
          />
          <DocCategoriesDialog
            open={showCategoriesDialog}
            onClose={handleCloseCategoriesDialog}
            orgName={router.query.username}
            orgId={orgId}
            podId={null}
            category={docCategory}
          />
          <DeleteDocDialog open={showDeleteDocDialog} onClose={handleCloseDeleteDialog} selectedDoc={selectedDoc} />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default Docs;

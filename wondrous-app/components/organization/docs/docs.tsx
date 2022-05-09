import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_DOCS, GET_ORG_DOCS_CATEGORIES } from 'graphql/queries/documents';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import Box from '@mui/material/Box';

import Tooltip from 'components/Tooltip';

import DocItemsMenu from 'components/DocItemsMenu';
import DeleteDocDialog from 'components/DeleteDocDialog';

import AddDocumentDialog from 'components/AddDocumentDialog';
import PinnedDocsSection from 'components/PinnedDocsSection';
import DocCategoriesSection from 'components/DocCategoriesSection';
import DocCategoriesDialog from 'components/DocCategoriesDialog/DocCategoriesDialog';

import Wrapper from '../wrapper/wrapper';
import styles from './docsStyles';

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

const Docs = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const router = useRouter();

  const { docData, categoriesData } = useGetOrgDocs(orgId);

  const [showDocDialog, setDocShowDialog] = useState(false);
  const [showDeleteDocDialog, setDeleteDocDialog] = useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [docCategory, setDocCategory] = useState({});
  const [selectedDoc, setSelectedDoc] = useState({});
  const [pinned, setPinned] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const openMenu = Boolean(menuAnchor);

  const handleItemClick = (event, doc) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDoc(doc);
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
    setDocShowDialog(true);
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
    <Wrapper orgData={orgData}>
      <Tooltip title="Create new doc category" placement="top">
        <Box sx={styles.categoryButtonContainer}>
          <Box sx={styles.categoryButton} onClick={() => setShowCategoriesDialog(true)}>
            <Image src="/images/icons/plus.svg" alt="plus icon" width={16} height={16} />
          </Box>
        </Box>
      </Tooltip>

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
        title={docCategory.name}
        orgId={orgId}
        category={docCategory}
        document={selectedDoc}
        pinned={pinned}
      />
      <DocCategoriesDialog
        open={showCategoriesDialog}
        onClose={handleCloseCategoriesDialog}
        orgName={router.query.username}
        orgId={orgId}
        category={docCategory}
      />
      <DeleteDocDialog open={showDeleteDocDialog} onClose={handleCloseDeleteDialog} selectedDoc={selectedDoc} />
    </Wrapper>
  );
};

export default Docs;

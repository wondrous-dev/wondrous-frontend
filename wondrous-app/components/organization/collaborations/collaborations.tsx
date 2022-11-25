import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_DOCS, GET_ORG_DOCS_CATEGORIES } from 'graphql/queries/documents';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import HeaderBlock from 'components/Settings/headerBlock';
import EntitySidebar from 'components/Common/SidebarEntity';
import CollabWrapper from './wrapper';
import { CollabsContainer } from './styles';
import Tabs from './tabs';
import { TAB_TYPES } from './constants';

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

function Collaborations(props) {
  const { orgData = {} } = props;
  const [activeTab, setActiveTab] = useState(TAB_TYPES.ACTIVE);

  return (
    <EntitySidebar>
      <CollabWrapper>
        <CollabsContainer>
          <HeaderBlock title={orgData?.name ? `Collabs with ${orgData?.name}` : 'Collabs'} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </CollabsContainer>
      </CollabWrapper>
    </EntitySidebar>
  );
}

export default Collaborations;

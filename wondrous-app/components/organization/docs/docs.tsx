import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_DOCS } from 'graphql/queries/documents';

import Box from '@mui/material/Box';

import GridLayout from 'components/GridLayout';
import GridItem from 'components/GridItem';
import ListLayout from 'components/ListLayout';
import ListItem from 'components/ListItem';
import PermissionTag from 'components/PermissionTag';

import Wrapper from '../wrapper/wrapper';
import { SectionTitleTypography, DocsButton } from './docsStyles';
import Image from 'next/image';

const useGetOrgDocs = (orgId) => {
  const [getOrgDocs, { data, loading }] = useLazyQuery(GET_ORG_DOCS, {
    pollInterval: 60000,
  });
  useEffect(() => {
    if (!data && orgId) {
      getOrgDocs({
        variables: {
          orgId: orgId,
        },
      });
    }
  }, [loading, orgId, getOrgDocs, data]);
  return { data, loading };
};

const SAMPLE_DATA = {
  description:
    'This is a short description of the page Lorem ipsum dolor sit amen klk manin, consectetur adipiscing elit. Nunc dictum quam in non feugiat aliquet ut integer.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum quam in non feugiat aliquet ut integer.',
  icon: { type: 'emoji', emoji: '💜' },
  media: 'https://www.notion.so/images/page-cover/met_gerome_1890.jpg',
  title: 'Spikes',
  url: 'https://www.notion.so',
};

const Docs = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const doc = SAMPLE_DATA;

  const { data, loading } = useGetOrgDocs(orgId);

  console.log(data);

  return (
    <Wrapper orgData={orgData}>
      <Box mt={6}>
        <Box display="flex" alignItems="center" mb={2.5}>
          <Box mr={1}>
            <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
          </Box>
          <SectionTitleTypography>Pinned Docs</SectionTitleTypography>
          <Box mr={1} />
          <PermissionTag>Contributors</PermissionTag>
          <Box flex="1" />

          <DocsButton color="secondary">
            <Box mr={1}>
              <Image src="/images/icons/addDoc.png" alt="folder icon" width={11} height={14} />
            </Box>
            Add Doc
          </DocsButton>
        </Box>

        <GridLayout>
          <GridItem
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.media}
            url={doc.url}
            permission="Admin Only"
          />
          <GridItem
            title={doc.title}
            description="This is a  hardcoded short description of the page"
            icon={doc.icon}
            media={doc.media}
            url={doc.url}
            permission="Admin Only"
          />
          <GridItem
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.media}
            url={doc.url}
            permission="Admin Only"
          />
        </GridLayout>
      </Box>

      <Box display="flex" alignItems="center" mb={2.5} mt={8}>
        <Box mr={1}>
          <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
        </Box>
        <SectionTitleTypography>WonderDAO Financial Resources</SectionTitleTypography>
        <Box mr={1} />
        <Box flex="1" />

        <DocsButton color="secondary">
          <Box mr={1}>
            <Image src="/images/icons/editFolder.png" alt="folder icon" width={18} height={14} />
          </Box>
          Edit Category
        </DocsButton>

        <Box mr={2} />

        <DocsButton color="secondary">
          <Box mr={1}>
            <Image src="/images/icons/addDoc.png" alt="folder icon" width={11} height={14} />
          </Box>
          Add Doc
        </DocsButton>
      </Box>

      <ListLayout>
        <ListItem
          title={doc.title}
          description={doc.description}
          icon={doc.icon}
          media={doc.media}
          url={doc.url}
          permission="Admin Only"
        />
        <ListItem
          title={doc.title}
          description="This is a  hardcoded short description of the page"
          icon={doc.icon}
          media={doc.media}
          url={doc.url}
          permission="Admin Only"
        />
        <ListItem
          title={doc.title}
          description={doc.description}
          icon={doc.icon}
          media={doc.media}
          url={doc.url}
          permission="Admin Only"
        />
      </ListLayout>
    </Wrapper>
  );
};

export default Docs;

import { useEffect, useRef, useState } from 'react';
import { tabs, tabsPerType } from 'components/Common/TaskViewModal/constants';
import {
  TabItemCount,
  TaskModalFooter,
  TaskSectionContent,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
} from 'components/Common/TaskViewModal/styles';
import { ApplicationsList } from 'components/GrantApplications';
import { useTaskContext } from 'utils/hooks';
import { ENTITIES_TYPES } from 'utils/constants';
import CommentList from 'components/Comment';

const TYPES = {
  [ENTITIES_TYPES.GRANT_APPLICATION]: tabsPerType.grantApplicationTabs,
  [ENTITIES_TYPES.GRANT]: tabsPerType.grantTabs,
};

const ViewGrantFooter = ({
  commentCount = 0,
  applicationsCount = 1,
  entityType = ENTITIES_TYPES.GRANT,
  entity,
  commentListProps = {},
}) => {
  const { isFullScreen } = useTaskContext();
  const [activeTab, setActiveTab] = useState(TYPES[entityType][0]);
  const ref = useRef();

  return (
    <TaskModalFooter fullScreen={isFullScreen}>
      <TaskSectionFooterTitleDiv>
        {TYPES[entityType].map((tab, index) => {
          const active = tab === activeTab;
          return (
            <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
              <TaskTabText isActive={active}>
                {tab}{' '}
                {tab === tabs.applications && entityType === ENTITIES_TYPES.GRANT && (
                  <TabItemCount isActive={active}>{applicationsCount}</TabItemCount>
                )}
                {tab === tabs.discussion && <TabItemCount isActive={active}>{commentCount}</TabItemCount>}
              </TaskTabText>
            </TaskSubmissionTab>
          );
        })}
      </TaskSectionFooterTitleDiv>

      <TaskSectionContent ref={ref}>
        <ApplicationsList display={activeTab === tabs.applications && entityType === ENTITIES_TYPES.GRANT} />
        {activeTab === tabs.discussion && <CommentList task={entity} entityType={entityType} {...commentListProps} />}
      </TaskSectionContent>
    </TaskModalFooter>
  );
};

export default ViewGrantFooter;

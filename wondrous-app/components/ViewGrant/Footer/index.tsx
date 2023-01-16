import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useGlobalContext, useTaskContext } from 'utils/hooks';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import CommentList from 'components/Comment';
import ActiveApplicationsList from 'components/GrantApplications/ActiveApplicationsList';
import { parseUserPermissionContext } from 'utils/helpers';

const TYPES = {
  [ENTITIES_TYPES.GRANT_APPLICATION]: tabsPerType.grantApplicationTabs,
  [ENTITIES_TYPES.GRANT]: tabsPerType.grantTabs,
};

const ViewGrantFooter = ({
  commentCount = 0,
  applicationsCount = 0,
  approvedApplicationsCount = 0,
  entityType = ENTITIES_TYPES.GRANT,
  entity,
  commentListProps = {},
}) => {
  const { isFullScreen } = useTaskContext();
  const [activeTab, setActiveTab] = useState(TYPES[entityType][0]);
  const ref = useRef();

  const { userPermissionsContext } = useGlobalContext();

  const canViewWorkspaces = useMemo(() => {
    if (entityType !== ENTITIES_TYPES.GRANT) return false;

    const permissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: entity?.org?.id,
      podId: entity?.pod?.id,
    });

    return (
      permissions.includes(PERMISSIONS.MANAGE_GRANTS) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.REVIEW_TASK)
    );
  }, [parseUserPermissionContext, userPermissionsContext, entityType, entity]);

  return (
    <TaskModalFooter fullScreen={isFullScreen}>
      <TaskSectionFooterTitleDiv>
        {TYPES[entityType].map((tab, index) => {
          const active = tab === activeTab;
          return (
            <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
              <TaskTabText isActive={active}>
                {tab}
                {tab === tabs.applications && entityType === ENTITIES_TYPES.GRANT && canViewWorkspaces && (
                  <TabItemCount isActive={active}>{applicationsCount}</TabItemCount>
                )}
                {tab === tabs.activeApplications && entityType === ENTITIES_TYPES.GRANT ? (
                  <TabItemCount isActive={active}>{approvedApplicationsCount}</TabItemCount>
                ) : null}
                {tab === tabs.discussion && <TabItemCount isActive={active}>{commentCount}</TabItemCount>}
              </TaskTabText>
            </TaskSubmissionTab>
          );
        })}
      </TaskSectionFooterTitleDiv>

      <TaskSectionContent ref={ref}>
        {activeTab === tabs.activeApplications && entityType === ENTITIES_TYPES.GRANT ? (
          <ActiveApplicationsList />
        ) : null}
        <ApplicationsList display={activeTab === tabs.applications && entityType === ENTITIES_TYPES.GRANT} />
        {activeTab === tabs.discussion && <CommentList task={entity} entityType={entityType} {...commentListProps} />}
      </TaskSectionContent>
    </TaskModalFooter>
  );
};

export default ViewGrantFooter;

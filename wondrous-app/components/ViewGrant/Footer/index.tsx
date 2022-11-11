import { useRef, useState } from 'react';
import { tabs, tabsPerType } from 'components/Common/TaskViewModal/constants';
import {
  TabItemCount,
  TaskModalFooter,
  TaskSectionContent,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
} from 'components/Common/TaskViewModal/styles';
import { List } from 'components/GrantApplications';
import { useTaskContext } from 'utils/hooks';

const ViewGrantFooter = ({ commentCount = 0, applicationsCount = 1 }) => {
  const { isFullScreen } = useTaskContext();
  const [activeTab, setActiveTab] = useState(tabs.applications);
  const ref = useRef();
  return (
    <TaskModalFooter fullScreen={isFullScreen}>
      <TaskSectionFooterTitleDiv>
        {tabsPerType.grantTabs.map((tab, index) => {
          const active = tab === activeTab;
          return (
            <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
              <TaskTabText isActive={active}>
                {tab} {tab === tabs.applications && <TabItemCount isActive={active}>{applicationsCount}</TabItemCount>}
                {tab === tabs.discussion && <TabItemCount isActive={active}>{commentCount}</TabItemCount>}
              </TaskTabText>
            </TaskSubmissionTab>
          );
        })}
      </TaskSectionFooterTitleDiv>
      <TaskSectionContent ref={ref}>{activeTab === tabs.applications && <List />}</TaskSectionContent>
    </TaskModalFooter>
  );
};

export default ViewGrantFooter;

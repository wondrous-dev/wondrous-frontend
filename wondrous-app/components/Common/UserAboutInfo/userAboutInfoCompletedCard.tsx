import { useRouter } from 'next/router';
import React from 'react';
import { delQuery } from '../../../utils';
import { TaskViewModal } from '../Task/modal';
import { UserAboutInfoCompletedTasks } from './styles';

const UserAboutInfoCompletedCard = (props) => {
  const router = useRouter();
  return (
    <>
      <TaskViewModal
        disableEnforceFocus
        shouldFocusAfterRender={false}
        open={!!router?.query?.task}
        handleClose={() => {
          const style = document.body.getAttribute('style');
          const top = style.match(/(?<=top: -)(.*?)(?=px)/);
          document.body.setAttribute('style', '');
          if (top?.length > 0) {
            window?.scrollTo(0, Number(top[0]));
          }
          router.push(`${delQuery(router.asPath)}`, undefined, {
            shallow: true,
          });
        }}
        taskId={(router?.query?.task || router?.query?.taskProposal)?.toString()}
        isTaskProposal={!!router?.query?.taskProposal}
      />
      <UserAboutInfoCompletedTasks task={props} />
    </>
  );
};

export default UserAboutInfoCompletedCard;

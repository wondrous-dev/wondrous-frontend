import { useRouter } from 'next/router';
import React from 'react';
import { delQuery } from '../../../utils';
import { TaskViewModal } from '../../Common/Task/modal';
import { AboutCompletedTasks } from './styles';

const AboutCompletedCard = (props) => {
  const router = useRouter();
  return (
    <>
      <TaskViewModal
        disableEnforceFocus
        open={router?.query?.task}
        shouldFocusAfterRender={false}
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
        taskId={router?.query?.task || router?.query?.taskProposal}
        isTaskProposal={!!router?.query?.taskProposal}
      />
      <AboutCompletedTasks task={props} />;
    </>
  );
};

export default AboutCompletedCard;

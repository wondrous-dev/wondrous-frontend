import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { Post } from '../../Common/Post';
import Wrapper from '../wrapper/wrapper';

const Analytics = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const [ref, inView] = useInView({});
  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const [toTime, setToTime] = useState(today);
  const [fromTime, setFromTime] = useState(lastWeek);
  const [getCompletedTasksBetweenPeriods, { data, loading }] = useLazyQuery(GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD);
  const contributorTaskData = data?.getCompletedTasksBetweenPeriods;
  useEffect(() => {
    if (orgId && fromTime && toTime) {
      getCompletedTasksBetweenPeriods({
        variables: {
          orgId,
          toTime,
          fromTime,
        },
      });
    }
  }, [orgId, fromTime, toTime]);

  return <Wrapper orgData={orgData}></Wrapper>;
};

export default Analytics;

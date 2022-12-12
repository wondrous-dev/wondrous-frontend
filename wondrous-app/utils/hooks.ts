import { NextRouter, useRouter } from 'next/router';
import { useContext, useState, useEffect, useRef, Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import apollo from 'services/apollo';
import { TokenGatingCondition } from 'types/TokenGating';
import {
  PRIVACY_LEVEL,
  TASK_TYPE,
  PERMISSIONS,
  BOUNTY_TYPE,
  MILESTONE_TYPE,
  ENTITIES_TYPES,
  TASK_STATUS_DONE,
} from 'utils/constants';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_TOKEN_GATING_CONDITIONS_FOR_ORG,
  GET_POD_BY_ID,
  GET_ORG_FROM_USERNAME,
} from 'graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATIONS_READ } from 'graphql/mutations';
import { LIMIT } from 'services/board';
import { useMe } from 'components/Auth/withAuth';
import {
  ColumnsContext,
  IsMobileContext,
  OrgBoardContext,
  PodBoardContext,
  SettingsBoardContext,
  SideBarContext,
  TextInputContext,
  UserBoardContext,
  ApprovedSubmissionContext,
  PaymentModalContext,
  SelectMembershipContext,
  UserProfileContext,
  GlobalContext,
  TokenGatingContext,
  HotkeyContext,
  ExploreGr15TasksAndBountiesContext,
  TaskContext,
  PageDataContext,
  ProjectContext
} from './contexts';
import { parseUserPermissionContext } from './helpers';

export const useHotkey = () => useContext(HotkeyContext);

export const useIsMobile = () => useContext(IsMobileContext);

export const useSideBar = () => useContext(SideBarContext);
// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Add event listener
      window?.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

export const useTextInput = () => useContext(TextInputContext);

export const useOrgBoard = () => useContext(OrgBoardContext);

export const usePodBoard = () => useContext(PodBoardContext);

export const useUserBoard = () => useContext(UserBoardContext);

export const useExploreGr15TasksAndBounties = () => useContext(ExploreGr15TasksAndBountiesContext);

export const useBoards = () => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  return { orgBoard, podBoard, userBoard, board };
};

export const useUserProfile = () => useContext(UserProfileContext);
// if (!context) {
//   console.log('useUserProfile must be used within a UserProfileContext Provider');
// }
// return context;

export const useProject = () => useContext(ProjectContext);

export const useSettings = () => useContext(SettingsBoardContext);

export const useColumns = () => {
  const context = useContext(ColumnsContext);
  // if (!context) {
  //   console.log('useColumns must be used within a ColumnsContext Provider');
  // }
  return context;
};

export const useApprovedSubmission = () => useContext(ApprovedSubmissionContext); // for payment, i think it's hacky

export const usePaymentModal = () => useContext(PaymentModalContext);

export const useSelectMembership = () => useContext(SelectMembershipContext);

export const useTokenGatingCondition = (): {
  editTokenGating: (tokenGatingCondition: TokenGatingCondition) => void;
  deleteTokenGating: (tokenGatingCondition: TokenGatingCondition) => void;
  closeTokenGatingModal: () => void;
  selectedTokenGatingCondition: TokenGatingCondition;
} => useContext(TokenGatingContext);

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref?.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; // assign the value of ref to the argument
  }, [value]); // this code will run when the value of 'value' changes
  return ref.current; // in the end, return the current ref value.
}
export default usePrevious;

export const useRouterQuery = ({
  router,
  query,
  defaultValue = [],
}: {
  router: NextRouter;
  query: string;
  defaultValue?: string[];
}): [string[], Dispatch<SetStateAction<string[]>>] => {
  const [state, setState] = useState(defaultValue);
  const routerQuery = router?.query?.[query];
  useEffect(() => {
    if (routerQuery) {
      setState(routerQuery?.toString().split(','));
    }
  }, [routerQuery]);
  return [state, setState];
};

export const useFilterQuery = (query, variables = {}, shouldFetch = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const getData = async () => {
    const { data } = await apollo.query({
      query,
      variables,
    });
    setData(Object.values(data).flat());
    setIsLoading(false);
  };
  useEffect(() => {
    if (query && shouldFetch) {
      setIsLoading(true);
      getData();
    }
  }, [query, variables, shouldFetch]);
  return { isLoading, data };
};

export const useGetPerStatusTaskCountForUserBoard = (userId) => {
  const [getPerStatusTaskCountForUserBoard, { data, loading }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD);

  useEffect(() => {
    if (userId) {
      getPerStatusTaskCountForUserBoard({
        variables: {
          userId,
        },
      });
    }
  }, [userId, getPerStatusTaskCountForUserBoard]);

  return { data, loading };
};

export const useGetPodById = (podId) => {
  const [getPodById, { data }] = useLazyQuery(GET_POD_BY_ID);
  useEffect(() => {
    if (!data && podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [podId, data, getPodById]);
  return data?.getPodById;
};

export const useGetOrgFromUsername = (username) => {
  const [getOrgFromUsername, { data }] = useLazyQuery(GET_ORG_FROM_USERNAME);
  useEffect(() => {
    if (!data && username) {
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, data, getOrgFromUsername]);
  return data?.getOrgFromUsername;
};

export const useGlobalContext = () => useContext(GlobalContext);

export const useCanViewTask = (task, userPermissionsContext, permissions) => {
  const [canViewTask, setCanViewTask] = useState(null);
  // if a pod exists we should check it's permissions else fallback to org permissions
  const hasPermissionToPod = task?.podId
    ? userPermissionsContext?.podPermissions[task?.podId] ||
      permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      task?.pod?.privacyLevel === PRIVACY_LEVEL.public
    : true;

  const hasPermissionToViewTask =
    task?.privacyLevel === PRIVACY_LEVEL.public ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    (userPermissionsContext?.orgPermissions[task?.orgId] && hasPermissionToPod);

  // there is no privacy level on proposal level / milestones so we will refer to org / pod policy
  const hasPermissionToViewProposalAndMilestones =
    (task?.org?.privacyLevel === PRIVACY_LEVEL.public && hasPermissionToPod) ||
    (userPermissionsContext?.orgPermissions[task?.orgId] && hasPermissionToPod) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS);

  useEffect(() => {
    if (task) {
      if (task.type === TASK_TYPE || task.type === BOUNTY_TYPE) return setCanViewTask(hasPermissionToViewTask);
      if (task.type === MILESTONE_TYPE || task.isProposal)
        return setCanViewTask(hasPermissionToViewProposalAndMilestones);
      return setCanViewTask(true);
    }
  }, [task]);

  return { canViewTask };
};

export const useScrollIntoView = (isElementToScroll, cb = null) => {
  const elementRef = useRef(null);
  useEffect(() => {
    if (isElementToScroll) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [elementRef, isElementToScroll]);
  return elementRef;
};

export const useNotifications = () => {
  const [hasMore, setHasMore] = useState(true);
  const { notifications, refetchNotifications, fetchMoreNotifications } = useGlobalContext();
  const [markAllNotificationsRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: ['getNotifications'],
  });
  const [markNotificationRead] = useMutation(MARK_NOTIFICATIONS_READ);

  const fetchMore = () => {
    fetchMoreNotifications({ variables: { offset: notifications?.length, limit: LIMIT } }).then(({ data }) =>
      setHasMore(data?.getNotifications?.length >= LIMIT)
    );
  };

  const unreadCount = useMemo(() => notifications?.filter((n) => !n.viewedAt).length, [notifications]);

  return {
    notifications,
    markAllNotificationsRead,
    unreadCount,
    markNotificationRead,
    fetchMore,
    hasMore,
  };
};

export const useSteps = (defaultStep = 0) => {
  const [step, setStep] = useState(defaultStep);

  const nextStep = () => setStep((prevState) => prevState + 1);

  const prevStep = () => setStep((prevState) => prevState - 1);

  useEffect(() => () => setStep(defaultStep), []);

  return { step, setStep, nextStep, prevStep };
};

export const usePermissions = (entity, isTaskProposal = false) => {
  const globalContext = useGlobalContext();
  const { id: userId } = useMe() || {};
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();
  const { orgId, podId, createdBy, assigneeId, type, status, taskApplicationPermissions } = entity || {};
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
  });
  const hasFullPermission = permissions.includes(PERMISSIONS.FULL_ACCESS);
  const hasEditPermission = permissions.includes(PERMISSIONS.EDIT_TASK);
  const createdByUser = createdBy === userId;
  const canEdit = hasFullPermission || hasEditPermission || createdByUser || (assigneeId && assigneeId === userId);
  const canArchive = permissions.includes(PERMISSIONS.MANAGE_BOARD) || hasFullPermission || createdByUser;
  const canViewApplications = hasFullPermission || hasEditPermission || (createdByUser && type === TASK_TYPE);
  const canDelete = canArchive && (type === ENTITIES_TYPES.TASK || type === ENTITIES_TYPES.MILESTONE || isTaskProposal);
  const canApproveProposal = hasFullPermission || permissions.includes(PERMISSIONS.CREATE_TASK);
  const canClaim =
    taskApplicationPermissions?.canClaim &&
    !assigneeId &&
    type !== BOUNTY_TYPE &&
    type !== MILESTONE_TYPE &&
    status !== TASK_STATUS_DONE;
  const canApply = !canClaim && taskApplicationPermissions?.canApply;
  return { canEdit, canArchive, canViewApplications, canDelete, canApproveProposal, canClaim, canApply };
};

export const useTaskContext = () => useContext(TaskContext);

export const useFullScreen = (defaultValue = false) => {
  const [isFullScreen, setIsFullScreen] = useState(defaultValue);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return { isFullScreen, toggleFullScreen };
};

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
};

export const usePageDataContext = () => useContext(PageDataContext);
export const useCheckOrgPermission = () => {
  const { orgBoard } = useBoards();
  const permissions = parseUserPermissionContext({
    userPermissionsContext: orgBoard?.userPermissionsContext,
    orgId: orgBoard?.orgData?.id,
  });
  const hasFullPermission = permissions.includes(PERMISSIONS.FULL_ACCESS);
  const hasEditPermission = permissions.includes(PERMISSIONS.EDIT_TASK);
  return hasFullPermission || hasEditPermission;
};

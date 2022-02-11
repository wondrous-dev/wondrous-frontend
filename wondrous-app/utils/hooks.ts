import { useContext, useState, useEffect } from 'react';

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
} from './contexts';

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

export const useBoard = () => {
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();

  return orgBoard || userBoard || podBoard;
};

export const useSettings = () => useContext(SettingsBoardContext);

export const useColumns = () => useContext(ColumnsContext);

export const useApprovedSubmission = () => useContext(ApprovedSubmissionContext); // for payment, i think it's hacky

export const usePaymentModal = () => useContext(PaymentModalContext);

import { useContext, useEffect, useState } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";

export const useModalState = ({ guide }) => {
  // const completedGuides = useUserCompletedGuides();

  const { setCurrentId } = useContext(TourDataContext);

  const completedGuides = [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(guide) && guide) {
      setCurrentId(guide);
      setIsModalOpen(true);
    }
    return () => setCurrentId(null);
  }, []);
  return {
    isModalOpen,
    setIsModalOpen,
  };
};

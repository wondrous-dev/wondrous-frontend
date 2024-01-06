import { useContext, useEffect, useState } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";

//TODO get rid of setCurrentId
//TODO modify home page to use this hook

export const useModalState = ({ guide }) => {
  const completedGuides = useUserCompletedGuides();

  const { setCurrentId } = useContext(TourDataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(guide) && guide) {
      setIsModalOpen(true);
    }
    return () => setCurrentId(null);
  }, []);
  return {
    isModalOpen,
    setIsModalOpen,
  };
};

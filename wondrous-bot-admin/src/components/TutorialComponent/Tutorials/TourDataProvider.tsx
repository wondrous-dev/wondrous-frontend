import { useMutation } from "@apollo/client";
import { SET_USER_COMPLETED_GUIDE } from "graphql/mutations/user";
import { GET_LOGGED_IN_USER } from "graphql/queries";
import { useState } from "react";
import { TourDataContext } from "utils/context/TourDataContext";
import { useUserCompletedGuides } from "utils/hooks";

const TourDataProvider = ({ children }) => {
  const completedQuestGuides = useUserCompletedGuides();

  const [shouldForceOpenTour, setShouldForceOpenTour] = useState(false);
  const [setUserCompletedGuide] = useMutation(SET_USER_COMPLETED_GUIDE, {
    refetchQueries: [{ query: GET_LOGGED_IN_USER }],
  });

  const handleTourVisit = (guideId) => {
    if (guideId && !completedQuestGuides?.includes(guideId)) {
      setUserCompletedGuide({
        variables: {
          guideId,
        },
      });
    }
  };

  return (
    <TourDataContext.Provider
      value={{
        handleTourVisit,
        shouldForceOpenTour,
        setShouldForceOpenTour,
      }}
    >
      {children}
    </TourDataContext.Provider>
  );
};

export default TourDataProvider;

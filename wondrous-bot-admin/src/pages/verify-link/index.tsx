import { useMutation } from "@apollo/client";
import PageSpinner from "components/PageSpinner";
import { ADD_LINK_CLICK } from "graphql/mutations";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const VerifyLinkPage = () => {
  const [addLinkClick] = useMutation(ADD_LINK_CLICK);
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const paramsQuery = searchParams.get("query");
  const decodedQuery = atob(paramsQuery || "");
  const query = JSON.parse(decodedQuery || "{}");

  const handleVerify = async () => {
    try {
      await addLinkClick({
        variables: {
          cmtyUserId: query.cmtyUserId,
          questStepId: query.questStepId,
          url: query.url,
        },
      });
      window.location.href = query.url;
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <PageSpinner />;
};

export default VerifyLinkPage;

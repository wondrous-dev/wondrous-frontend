import PageSpinner from "components/PageSpinner";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RedirectPage = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const url = searchParams.get("url");
  
  useEffect(() => {
    window.location.href = url;
  }, []);

  return <PageSpinner />;
};

export default RedirectPage;

import CmtyUserActivityComponent from "components/CmtyUserActivity";
import { useParams } from "react-router-dom";

const CmtyUserActivityPage = () => {
    const {id} = useParams();

  return <CmtyUserActivityComponent cmtyUserId={id}/>;
};

export default CmtyUserActivityPage;

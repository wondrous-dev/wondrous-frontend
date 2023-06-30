import PaymentLedger from "components/PaymentLedger";
import { useParams } from "react-router-dom";

const PaymentPage = () => {
  let { id } = useParams();
  if(!id) return null;
  return <PaymentLedger questId={id} />;
};

export default PaymentPage;

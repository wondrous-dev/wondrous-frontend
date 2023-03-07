import { createContext } from "react";

interface Value {
    orgId: string;
    podId: string;
    data: any;
    setData: (data: any) => void;
    onClose: () => void;
}

const ConnectionContext = createContext<Value>({
    orgId: '',
    podId: '',
    data: {},
    setData: () => {},
    onClose: () => {},
})

export default ConnectionContext
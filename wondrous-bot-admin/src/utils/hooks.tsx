import { useState } from "react";

const useCreateConfiguration = () => {
    const [configuration, setConfiguration] = useState([]);
    return {
        configuration,
        setConfiguration
    }
};

export default useCreateConfiguration;
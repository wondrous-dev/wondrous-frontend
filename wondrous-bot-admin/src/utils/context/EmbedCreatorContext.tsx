import { createContext, useContext } from "react";

const EmbedCreatorContext = createContext(null);

const useEmbedCreatorContext = () => useContext(EmbedCreatorContext);
export { EmbedCreatorContext, useEmbedCreatorContext };

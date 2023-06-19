import { config } from "./config";

export const getStepsConfig = (pathname) => {
  const {
    steps = [],
    id,
    disableInteraction,
  }: any = config.find((item) => {
    const pattern = new RegExp(`^${item.path.replace(/:\w+/g, "[\\w-]+")}$`, "gi");

    return pattern.test(pathname);
  }) || {};
  return {
    steps,
    id,
    disableInteraction,
  };
};

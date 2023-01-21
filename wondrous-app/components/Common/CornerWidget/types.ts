export type CornerWidgetComponentType = {
  id: string;
  type: string;
  orgName?: string;
  podName?: string;
  handleClose: () => void;
};

export type CornerWidgetType = {
  open: boolean;
  id: string;
  type: string;
  orgName: string;
  podName?: string;
};

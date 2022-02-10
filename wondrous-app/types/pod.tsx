export type OrgPod = {
  __typename: string;
  id: string;
  name: string;
  username: string;
  description: string;
  privacyLevel: string;
  headerPicture?: any;
  profilePicture?: any;
  thumbnailPicture?: any;
  createdBy: string;
  createdAt: Date;
  orgId: string;
  tags?: any;
  contributorCount: number;
  tasksCompletedCount: number;
};

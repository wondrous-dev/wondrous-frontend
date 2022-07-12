import { ColorTypes } from 'utils/constants';

const styles = {
  root: {
    display: 'flex',

    alignItems: 'center',
    mr: 1.25,
  },
  whiteText: {
    color: 'white',
    width: 'max-content',
    mr: 1,
  },
  role: {
    color: 'white',
    border: ({ palette }) => `1px solid ${palette.grey10}`,
    p: 0.75,
    lineHeight: '16px',
    fontWeight: 400,
    textTransform: 'capitalize',
    width: 'max-content',
  },
  owner: {
    border: `1px solid ${ColorTypes.LepidolitePink}`,
  },
  coreTeam: {
    border: `1px solid ${ColorTypes.LimeGreen}`,
  },
  contributor: {
    border: `1px solid ${ColorTypes.SunstoneOrange}`,
  },
};

export default styles;

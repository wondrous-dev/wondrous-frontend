import { scale, moderateScale, verticalScale } from '../../../utils/scale'
import { White, Blue400, Blue500, Black } from '../../../constants/Colors'

const baseStyle = {
  maxWidth: moderateScale(344),
  width: '100%',
  padding: 10,
  borderRadius: 4,
  alignItems: 'center'
}

export default {
  primary: {
    ...baseStyle,
    backgroundColor: Blue500,
    color: White,
  },
  secondary: {
    ...baseStyle,
    backgroundColor: White
  },
  google: {
    height: 68,
    display: 'flex',
    justifyContent: 'center',
    width: 300
  },
  facebook: {
    height: 68,
    display: 'flex',
    justifyContent: 'center',
    width: 300,
    backgroundColor: '#1877f2'
  }
}

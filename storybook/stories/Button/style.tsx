import { scale, moderateScale, verticalScale } from '../../../utils/scale'
import { White, Blue400, Black } from '../../../constants/Colors'

const baseStyle = {
  maxWidth: moderateScale(300),
  width: '100%',
  padding: 10,
  borderRadius: 4,
  alignItems: 'center'
}

export default {
  primary: {
    ...baseStyle,
    backgroundColor: Blue400,
    color: White,
  },
  secondary: {
    ...baseStyle,
    backgroundColor: White
  },
  google: {
    height: 68,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300
  }
}

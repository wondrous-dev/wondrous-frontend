import { scale, moderateScale, verticalScale } from '../../../utils/scale'
import { White, Blue400, Black } from '../../../constants/Colors'

const baseStyle = {
  maxWidth: moderateScale(300),
  width: '100%',
  padding: 10,
  textAlign: 'center',
  borderRadius: 4
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
  }
}

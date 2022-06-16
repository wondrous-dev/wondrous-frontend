import { scale, moderateScale, verticalScale } from '../../../utils/scale'
import { White, palette.blue400, palette.blue500, palette.black, palette.grey800 } from '../../../constants/Colors'

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
    backgroundColor: palette.blue500,
    color: White,
  },
  secondary: {
    ...baseStyle,
    backgroundColor: White
  },
  google: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    width: 300,
  },
  facebook: {
    width: 300,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#1877f2'
  },
  apple: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    width: 300
  },
  emailLogin: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    width: 300,
  }
}

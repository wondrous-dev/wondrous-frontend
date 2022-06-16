import { moderateScale } from '../../../utils/scale'
import palette from 'theme/palette'

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
    color: palette.white,
  },
  secondary: {
    ...baseStyle,
    backgroundColor: palette.white
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

import { scale, moderateScale, verticalScale } from '../../../utils/scale'
import { White, Red400 } from '../../../constants/Colors'

export default {
  title: {
    fontFamily: 'Pacifico',
    fontSize: 34,
    color: White
  },
  subheading: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 20,
    color: White,
    fontWeight: 'bold'
  },
  paragraph: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    color: White,
    lineHeight: 24
  },
  buttonText: {
    fontFamily: 'Rubik',
    fontSize: 14,
    lineHeight: 22
  },
  errorText: {
    fontFamily: 'Rubik',
    fontSize: 12,
    lineHeight: 20,
    color: Red400
  }
}

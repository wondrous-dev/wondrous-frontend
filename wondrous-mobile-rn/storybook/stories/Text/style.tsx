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
    lineHeight: 24
  },
  regular: {
    fontFamily: 'Rubik Light',
    fontSize: 14,
    lineHeight: 22
  },
  buttonText: {
    fontFamily: 'Rubik',
    fontSize: 16,
    lineHeight: 22
  },
  tinyText: {
    fontFamily: 'Rubik Light',
    fontSize: 12,
    lineHeight: 20
  },
  errorText: {
    fontFamily: 'Rubik',
    fontSize: 14,
    lineHeight: 20,
    color: Red400
  }
}

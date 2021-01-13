import { StyleSheet } from 'react-native'
import { Blue500, Grey400 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'

export const profileStyles = StyleSheet.create({
  profileContainer: {
    marginTop: spacingUnit * 4
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  },
  profilePlaceholderContainer: {
    width: spacingUnit * 8,
    height: spacingUnit * 8,
    borderRadius: spacingUnit * 4,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Blue500,
    borderWidth: 2
  },
  profilePlaceholderImage: {
    width: spacingUnit * 8,
    height: spacingUnit * 8,
    borderRadius: 4
  },
  profileImage: {
    width: spacingUnit * 8,
    height: spacingUnit * 8,
    borderRadius: 4 * spacingUnit
  },
  sectionChoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingUnit * 3,
    borderBottomWidth: 1,
    borderBottomColor: Grey400
  }
})
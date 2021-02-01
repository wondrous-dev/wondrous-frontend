import { StyleSheet } from 'react-native'
import { Black, Blue400, Red400, Yellow300 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'

export const pageStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit * 1.5
  },
  priorityContainer: {
    flexDirection: 'row',
    marginRight: spacingUnit,
    paddingLeft: spacingUnit * 1.5,
    paddingRight: spacingUnit * 1.5,
    borderRadius: 8
  },
  title: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: Black
  },
  paragraph: {
    fontFamily: 'Rubik Light'
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    color: Blue400,
    marginLeft: spacingUnit
  },
  subContainer: {
    flexDirection: 'row'
  }
})

export const sortPriority = (priority) => {
  switch(priority) {
    case 'high':
      return Red400
    case 'medium':
      return Yellow300
    case 'low':
      return Blue400
  }
}
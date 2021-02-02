import { StyleSheet } from 'react-native'
import { Blue500, Grey400, Grey300 } from '../../constants/Colors'
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
    width: spacingUnit * 10,
    height: spacingUnit * 10,
    borderRadius: spacingUnit * 5,
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
  imageContainer: {
    width: spacingUnit * 10,
    height: spacingUnit * 10
  },
  profileImage: {
    width: spacingUnit * 10,
    height: spacingUnit * 10,
    borderRadius: 5 * spacingUnit
  },
  sectionChoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingUnit * 3,
    borderBottomWidth: 1,
    borderBottomColor: Grey400
  },
  changeRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: spacingUnit * 5,
    marginBottom: spacingUnit * 2
  },
  changeRowParagraphText: {
    marginRight: spacingUnit * 3,
    width: spacingUnit * 10
  },
  changeRowText: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginTop: -2,
    borderBottomColor: Grey300,
    paddingBottom: spacingUnit,
    flex: 1,
    lineHeight: 22
  },
  editRowContainer: {
    borderBottomColor: Grey300,
    borderBottomWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  }
})

export const listStyles = StyleSheet.create({
  listContainer: {
    marginTop: spacingUnit * 2
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    alignItems: 'flex-start',
    marginBottom: spacingUnit * 2
  },
  listImage: {
    width: spacingUnit * 6,
    height: spacingUnit * 6,
    borderRadius: spacingUnit * 3,
    marginRight: spacingUnit
  }
})
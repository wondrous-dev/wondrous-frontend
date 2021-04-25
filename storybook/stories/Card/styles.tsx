import { StyleSheet } from 'react-native'
import { Grey400, Blue400, Green400, White, Grey450, Purple, Red400, Yellow300, Grey300, Grey800 } from '../../../constants/Colors'
import { spacingUnit, renderMentionString } from '../../../utils/common'

export const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 15,
    marginBottom: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Grey400,
    elevation: 7,
    shadowOpacity: 0.25,
    shadowColor: Grey400,
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 }
  },
  text: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 16,
    lineHeight: 24
  },
  underlayRight: {
    // flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Green400,
    color: White
  },
  underlayLeft: {
    // flex: 1,
    backgroundColor: Grey400,
    justifyContent: "flex-end"
  },
  bottomInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dueText: {
    color: Grey450
  },
  topInfoContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  profilePicture: {
    width: spacingUnit * 4,
    height: spacingUnit * 4,
    borderRadius: spacingUnit * 2
  }
})
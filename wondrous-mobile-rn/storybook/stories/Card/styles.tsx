import { StyleSheet } from 'react-native'
import palette from 'theme/palette'
import { spacingUnit } from '../../../utils/common'

export const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  flex: {
    flex: 1,
  },
  addTask: {
    flexDirection: 'row',
    marginTop: spacingUnit,
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center'
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
    borderColor: palette.grey400,
    elevation: 7,
    shadowOpacity: 0.25,
    shadowColor: palette.grey400,
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
    backgroundColor: palette.green400,
    color: palette.white
  },
  underlayLeft: {
    // flex: 1,
    backgroundColor: palette.grey400,
    justifyContent: "flex-end"
  },
  bottomInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dueText: {
    color: palette.grey450
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
import styled from "styled-components";
import {IconButton, Typography} from "@material-ui/core";

export const TaskColumnContainer = styled.div`
	max-width: 325px;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const TaskColumnContainerHeader = styled.div`
	width: 100%;
	height: 24px;
	display: flex;
	justify-content: space-between;
`

export const TaskColumnContainerHeaderTitle = styled(Typography)({
  '&.MuiTypography-body1': {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left',
    paddingLeft: 20,
    color: '#FFF',
    width: '100%',
  },
})

export const TaskColumnContainerHeaderPlusButton = styled(IconButton)``
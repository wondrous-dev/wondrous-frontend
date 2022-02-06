import styled from 'styled-components'
import { Grey250, White } from '../../../theme/colors'

export const ToggleViewWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;

    width: 130px;
    min-width: 130px;
    height: 40px;

    & > *:first-child {
		border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
	}

    & > *:last-child {
		border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
	}

    & > *:last-child {
        border-right: 0.5px solid #363636;    
    }

    & > *:last-child.active {
        border-right: 0.5px solid #363636;    
    }
`

export const ToggleViewOption = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	color: ${White};

	border: 0.5px solid #363636;
	border-right: 0;

	opacity: 0.6;

	cursor: pointer;

	&.active {
		opacity: 1;

		background: linear-gradient(90.93deg, #1e1e1e 3.85%, #141414 101.76%);
		border: 0.5px solid #363636;
	}
`

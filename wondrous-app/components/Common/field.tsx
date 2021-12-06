import styled from 'styled-components'
import { Background, Grey50 } from '../../services/colors'

export const Field = styled.input`
 && {
	 padding: ${(props) => props.url ? "15px 0 15px 50px" : "15px 0 15px 15px"};
	 margin: 5px 0;
	 border-radius: 8px;
	 border: 0px;
	 color: ${Grey50};
	 outline: none;
	 font-size: 14px;
	 background: ${(props) => props.url ? Background+" url("+props.url+") no-repeat 10px" : Background}
 }
`

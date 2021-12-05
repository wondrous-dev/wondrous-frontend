import styled from 'styled-components'

export const Field = styled.input`
 && {
	 padding: ${(props) => props.url ? "15px 0 15px 50px" : "15px 0 15px 15px"};
	 margin: 5px 0;
	 border-radius: 8px;
	 border: 0px;
	 color: #828282;
	 outline: none;
	 font-size: 14px;
	 background: ${(props) => props.url ? "#0F0F0F url("+props.url+") no-repeat 10px" : "#0F0F0F"}
 }
`

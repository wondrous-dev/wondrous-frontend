import styled from 'styled-components'
import { Background, Grey50 } from '../../services/colors'

export const FieldWrapper = styled.div`
  position: relative;
  
  & > svg {
		position: absolute;
		height: 20px;
		width: 20px;
		top: 18px;
		left: 15px;
  }
`

export const FieldInput = styled.input`
&& {
	padding: 15px 0 15px 50px;
	margin: 5px 0;
	border-radius: 8px;
	border: 0px;
	color: ${Grey50};
	outline: none;
	font-size: 14px;
	background: ${Background};
	width: 100%;
}
`

export const Field = ({ ...props }) => (
  <FieldWrapper>
    {props.icon !== null && props.icon()}
    <FieldInput {...props} />
  </FieldWrapper>
)
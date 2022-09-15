import Wrapper from 'components/Common/DropdownItem/styles';

const DropdownItem = ({ children, ...props }) => <Wrapper {...props}>{children}</Wrapper>;

export default DropdownItem;

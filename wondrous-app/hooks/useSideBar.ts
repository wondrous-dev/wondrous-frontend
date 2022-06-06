import { useContext } from 'react';
import { SideBarContext } from 'utils/contexts';

const useSideBar = () => useContext(SideBarContext);

export default useSideBar;

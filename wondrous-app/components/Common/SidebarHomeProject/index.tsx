import SidebarItem from 'components/Common/SidebarItem';
import HomeIcon from 'components/Icons/home';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UnstyledLink } from './styles';

const SidebarHomeProject = () => {
  const router = useRouter();

  const isActive = router.pathname.includes('/dashboard');

  console.log(router);
  return (
    <UnstyledLink href="/dashboard">
      <SidebarItem Icon={HomeIcon} isActive={isActive}>
        Project home
      </SidebarItem>
    </UnstyledLink>
  );
};

export default SidebarHomeProject;

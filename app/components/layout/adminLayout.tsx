import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { NavbarWrapper } from '../navbar/navbar';
import { SidebarWrapper } from '../sidebar/sidebar';
import { SidebarContext } from './layout-context';
import { WrapperLayout } from './layout.styles';
import { Flex } from '../styles/flex';

interface Props {
   children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [_, setLocked] = useLockedBody(false);
   const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
      setLocked(!sidebarOpen);
   };

   return (
      <SidebarContext.Provider
         value={{
            collapsed: sidebarOpen,
            setCollapsed: handleToggleSidebar,
         }}
      >
         <WrapperLayout>
            <SidebarWrapper />
            <NavbarWrapper>
               <Flex
                  css={{
                     'mt': '$5',
                     'px': '$6',
                     '@sm': { mt: '$10', px: '$16', },
                  }}
                  justify={'center'}
                  direction={'column'}
               >
                  {children}
               </Flex>
            </NavbarWrapper>
         </WrapperLayout>
      </SidebarContext.Provider>
   );
};

export default AdminLayout

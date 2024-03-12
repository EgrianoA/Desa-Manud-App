import React, { useState } from 'react';
import { Box } from '../styles/box';
import { Sidebar } from './sidebar.styles';
import { Flex } from '../styles/flex';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { useSidebarContext } from '../layout/layout-context';
import { useRouter } from 'next/router';
import { HomeOutlined, UserOutlined, FolderOutlined, BookOutlined, ContainerOutlined, TeamOutlined, ReadOutlined, FileDoneOutlined } from '@ant-design/icons'
import Image from 'next/image'

export const SidebarWrapper = () => {
   const router = useRouter();
   const { collapsed, setCollapsed } = useSidebarContext();

   return (
      <Box
         as="aside"
         css={{
            height: '100vh',
            zIndex: 202,
            position: 'sticky',
            top: '0',
         }}
      >
         {collapsed ? <Sidebar.Overlay onClick={setCollapsed} /> : null}

         <Sidebar collapsed={collapsed}>
            <Sidebar.Header>
               <Image src="/Desa manud logo.png" width='150px' height='150px' />
            </Sidebar.Header>
            <Flex
               direction={'column'}
               justify={'between'}
               css={{ height: '100%' }}
            >
               <Sidebar.Body className="body sidebar">
                  <SidebarItem
                     title="Beranda"
                     icon={<HomeOutlined />}
                     isActive={router.pathname === '/admin'}
                     href="/admin"
                  />
                  <SidebarMenu title="">
                     <SidebarItem
                        isActive={router.pathname === '/admin/users'}
                        title="Daftar Pengguna"
                        icon={<UserOutlined />}
                        href="/admin/users"
                     />
                     <SidebarItem
                        isActive={router.pathname === '/admin/articles'}
                        title="Daftar Artikel"
                        icon={<ContainerOutlined />}
                        href="/admin/articles"
                     />
                  </SidebarMenu>
               </Sidebar.Body>
            </Flex>
         </Sidebar>
      </Box>
   );
};

import { Input, Link, Navbar, Text } from '@nextui-org/react';
import React, { useMemo } from 'react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import allUserData from '../../public/dummyData/userList.json'
import { useUserContext } from '../../utilities/authorization';

interface Props {
   children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
   const personalUserData = allUserData[0]
   const userContext = useUserContext();
   const userFullname = useMemo(() => (userContext?.userFullName), [userContext?.userFullName])

   const collapseItems = [
      'Profile',
      'Dashboard',
      'Activity',
      'Analytics',
      'System',
      'Deployments',
      'My Settings',
      'Team Settings',
      'Help & Feedback',
      'Log Out',
   ];
   return (
      <Box
         css={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
         }}
      >
         <Navbar
            isBordered
            css={{
               'borderBottom': '1px solid $border',
               'justifyContent': 'space-between',
               'width': '100%',
               '@md': {
                  justifyContent: 'space-between',
               },

               '& .nextui-navbar-container': {
                  'border': 'none',
                  'maxWidth': '100%',

                  'gap': '$6',
                  '@md': {
                     justifyContent: 'space-between',
                  },
               },
            }}
         >
            <Navbar.Content showIn="md">
               <BurguerButton />
            </Navbar.Content>
            <Navbar.Content
               hideIn={'md'}
               css={{
                  marginRight: 20,
                  marginLeft: 'auto',
               }}
            >
               {userFullname}
            </Navbar.Content>
            <Navbar.Content>
               <Navbar.Content>
                  <UserDropdown />
               </Navbar.Content>
            </Navbar.Content>

            <Navbar.Collapse>
               {collapseItems.map((item, index) => (
                  <Navbar.CollapseItem
                     key={item}
                     activeColor="secondary"
                     css={{
                        color:
                           index === collapseItems.length - 1 ? '$error' : '',
                     }}
                     isActive={index === 2}
                  >
                     <Link
                        color="inherit"
                        css={{
                           minWidth: '100%',
                        }}
                        href="#"
                     >
                        {item}
                     </Link>
                  </Navbar.CollapseItem>
               ))}
            </Navbar.Collapse>
         </Navbar>
         {children}
      </Box>
   );
};

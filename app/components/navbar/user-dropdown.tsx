import { Avatar, Dropdown, Navbar, Text } from '@nextui-org/react';
import React, { useCallback } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import allUserData from '../../public/dummyData/userList.json'
import { useUserContext, initialUserContextData } from '../../utilities/authorization'
import { useRouter } from 'next/router';

export const UserDropdown = () => {
   const personalUserData = allUserData[0]
   const userContext = useUserContext();
   const router = useRouter()

   const dropdownAction = useCallback((actionKey: string) => {
      if (actionKey === 'logout') {
         if (typeof window !== 'undefined') {
            localStorage.removeItem("token")
            userContext.setUserContext(initialUserContextData)
         }
         router.push('/admin/login')
      }


   }, [router, userContext])
   return (
      <Dropdown placement="bottom-right">
         <Navbar.Item>
            <Dropdown.Trigger>
               <Avatar
                  bordered
                  as="button"
                  color="success"
                  size="md"
                  src={personalUserData.profilePicture}
               />
            </Dropdown.Trigger>
         </Navbar.Item>
         <Dropdown.Menu
            aria-label="User menu actions"
            onAction={(actionKey) => dropdownAction(actionKey)}
         >
            <Dropdown.Item key="logout" withDivider color="error">
               Keluar
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};

import {Dropdown, Navbar} from '@nextui-org/react';
import React from 'react';
import {NotificationIcon} from '../icons/navbar/notificationicon';

export const NotificationsDropdown = () => {
   return (
      <Dropdown placement="bottom-right">
         <Dropdown.Trigger>
            <Navbar.Item>
               <NotificationIcon />
            </Navbar.Item>
         </Dropdown.Trigger>
         <Dropdown.Menu
            aria-label="Avatar Actions"
            css={{
               '$$dropdownMenuWidth': '340px',
               '$$dropdownItemHeight': '70px',
               '& .nextui-dropdown-item': {
                  'py': '$4',
                  // dropdown item left icon
                  'svg': {
                     color: '$secondary',
                     mr: '$4',
                  },
                  // dropdown item title
                  '& .nextui-dropdown-item-content': {
                     w: '100%',
                     fontWeight: '$semibold',
                  },
               },
            }}
         >
            <Dropdown.Section title="Notifikasi">
               <Dropdown.Item
                  key="1"
                  showFullDescription
                  description="Agustina Widyasari menambahkan komentar pada PMR-TVRI-29."
               >
                  📣  Komentar baru pada PMR-TVRI-29
               </Dropdown.Item>
               <Dropdown.Item
                  key="2"
                  showFullDescription
                  description="Perhatikan pekerjaan yang sedang anda lakukan agar tidak melewati batas waktu pemeriksaan"
               >
                  📣 Batas waktu pemeriksaan selesai tersisa 1 minggu.
               </Dropdown.Item>
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};

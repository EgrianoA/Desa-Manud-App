import React from 'react';
import { Text, Link } from '@nextui-org/react';
import { Box } from '../styles/box';
import dynamic from 'next/dynamic';
import { Flex } from '../styles/flex';
import { TableWrapper } from '../table/table';
import NextLink from 'next/link';
import { CardBalance1 } from './card-balance1';
import { CardBalance2 } from './card-balance2';
import { CardBalance3 } from './card-balance3';
import { CardAgents } from './card-agents';
import { CardTransactions } from './card-transactions';

const Chart = dynamic(
   () => import('../charts/steam').then((mod) => mod.Steam),
   {
      ssr: false,
   }
);



export const Content = () => (<Box css={{ overflow: 'hidden', height: '100%' }}>

   {/* Table Latest Users */}
   <Flex
      direction={'column'}
      justify={'center'}
      css={{
         'width': '100%',
         'py': '$10',
         'px': '$10',
         'mt': '$8',
         '@sm': { px: '$20' },
      }}
   >
      <Flex justify={'between'} wrap={'wrap'}>
         <Text
            h3
            css={{
               'textAlign': 'center',
               '@sm': {
                  textAlign: 'inherit',
               },
            }}
         >
            Daftar Tugas Investigasi
         </Text>
      </Flex>
      <TableWrapper />
   </Flex>
</Box>
)
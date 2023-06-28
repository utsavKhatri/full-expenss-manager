import React, { Suspense } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import Loader from './Loader';

const MainBalanceChart = React.lazy(() => import('./charts/MainBalanceChart'));
const MainChart = React.lazy(() => import('./charts/MainChart'));

const ChartAccordion = ({
  chartLable,
  chartData,
  listIncome,
  listBalance,
}: {
  chartLable: any;
  chartData: any;
  listIncome: any;
  listBalance: any;
}) => {
  return (
    <Suspense fallback={<Loader />}>
      <Accordion w="100%" allowMultiple>
        <AccordionItem w="100%">
          <AccordionButton
            p={5}
            bg={useColorModeValue('gray.50', 'gray.900')}
            rounded="lg"
            roundedBottom="none"
            shadow="lg"
            display="flex"
            alignItems="center"
            height="full"
            justifyContent="space-between"
          >
            <Box flex="1" textAlign="left">
              View Transactions Chart
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <MainChart chartLable={chartLable} chartData={chartData} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem w="100%">
          <AccordionButton
            p={5}
            bg={useColorModeValue('gray.50', 'gray.900')}
            rounded="lg"
            roundedTop="none"
            shadow="lg"
            display="flex"
            alignItems="center"
            height="full"
            justifyContent="space-between"
          >
            <Box flex="1" textAlign="left">
              View Income Expense Chart
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Stack justifyContent="center" alignItems="center" spacing={4}>
              <MainBalanceChart
                chartLable={listIncome}
                chartData={listBalance}
              />
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Suspense>
  );
};

export default ChartAccordion;

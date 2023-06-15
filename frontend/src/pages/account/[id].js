import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ExportToCsv } from 'export-to-csv';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MainTemplate from '../components/maintemplate';
import { useRouter } from 'next/router';
import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  MinusIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons';
import AddTranjection from '../components/AddTranjection';
import UpdateTransactions from '../components/UpdateTrans';
import BalanceChart from '../components/BalanceChart';
import Loader from '../components/Loader';
import 'jspdf-autotable';
import Report from '../components/Report';
import {
  createTheme,
  FormControl,
  InputLabel,
  ThemeProvider,
} from '@mui/material';
import MaterialReactTable from 'material-react-table';
import ExportData from '../components/ExportData';
import TransactionChart from '../components/TransactionChart';
import ApexTransactionChart from '../components/ApexTransactionChart';

const account = ({ id }) => {
  const [shareList, setShareList] = useState();
  const [transData, setTransData] = useState();
  const [isShareModal, setIsShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartData1, setChartData1] = useState([]);
  const [intChartData, setIntChartData] = useState([]);
  const [intLabelData, setIntLabelData] = useState([]);
  const [chartLable, setChartLable] = useState([]);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [chartLable1, setChartLable1] = useState([]);
  const [email, setEmail] = useState('');
  const [sampleAccData, setSampleAccData] = useState();
  const [intLoading, setIntLoading] = useState(true);
  const [limit, setLimit] = useState(15);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartVisible, setChartVisibale] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [currentuserData, setCurrentuserData] = useState();
  const [intervalData, setIntervalData] = useState(false);
  const reportRef = useRef();
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const fetchAccData = () => {
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `http://localhost:1337/editAccount/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response.data.data);
        setSampleAccData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: 'visit to homepage, something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        window.location.href = '/';
      });
  };
  const fetchSignleAcc = () => {
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `http://localhost:1337/viewTransaction/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response.data);
        setTransData(response.data);
        const newArr = response.data.data.map((element) => {
          return parseFloat(element.amount);
        });
        const newLablelArr = response.data.data.map((element) => {
          return new Date(element.createdAt).toDateString();
        });
        setChartData(newArr);
        setIntChartData(newArr.slice(0, limit));
        setChartLable(newLablelArr);
        setIntLabelData(newLablelArr.slice(0, limit));
        setIntLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: 'visit to homepage, something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        window.location.href = '/';
      });
  };

  const handleLoadmore = () => {
    setIntervalData(false);
    setLimit(limit + 15);
    setIntChartData(chartData.slice(0, limit));
    setIntLabelData(chartLable.slice(0, limit));
  };
  const handleLoadAllMore = () => {
    setIntervalData(false);

    setIntChartData(chartData);
    setIntLabelData(chartLable);
  };

  const handleLoadLess = () => {
    setIntervalData(false);

    setLimit(15);
    setIntChartData(chartData.slice(0, limit));
    setIntLabelData(chartLable.slice(0, limit));
  };

  const handleShareAcc = () => {
    setIsShareModal(true);
    onOpen();
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `http://localhost:1337/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response);
        setShareList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };
  const handleShareToUser = () => {
    // console.log('email to send---> ', email);
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'POST',
      url: `http://localhost:1337/account/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: email,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response);
        if (response.status == 200) {
          onClose();
          toast({
            title: 'Share Successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchSignleAcc();
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const deleteTrans = (tId) => {
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);

    axios
      .delete(`http://localhost:1337/rmTransaction/${tId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast({
          title: 'Transaction Deleted Successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchSignleAcc();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      window.location.href = '/';
    } else {
      setCurrentuserData(JSON.parse(localStorage.getItem('userInfo')));
      fetchSignleAcc();
      fetchAccData();
      axios
        .get('http://localhost:1337/category')
        .then((res) => {
          setCatlist(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleSelectOption = (e) => {
    // console.log(e.target.value);
    // console.log(
    //   `http://localhost:1337/transaction/duration/${id}?filter=${e.target.value}`
    // );
    const user = localStorage.getItem('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `http://localhost:1337/transaction/duration/${id}?filter=${e.target.value}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        const newArr = response.data.map((element) => {
          return parseFloat(element.amount);
        });
        const newLablelArr = response.data.map((element) => {
          return new Date(element.createdAt).toISOString();
        });
        setChartData1(newArr);
        setChartLable1(newLablelArr);
        setIntervalData(true);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: 'visit to homepage, something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'text',
        header: 'Text',
      },
      {
        accessorKey: 'transfer',
        header: 'Transfer',
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
        enableEditing: false,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: ({ cell }) => {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(cell.getValue());
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        enableEditing: false,
        Cell: ({ cell }) => {
          return new Date(cell.getValue()).toLocaleDateString();
        },
      },
    ],
    []
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(
      rows.map((row) => {
        return {
          text: row.original.text,
          transfer: row.original.transfer,
          category: row.original.category.name,
          amount: row.original.amount,
          createdAt: new Date(row.original.createdAt).toLocaleDateString(),
        };
      })
    );
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  return intLoading == true ? (
    <Loader />
  ) : (
    <MainTemplate>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textTransform={'capitalize'}>
            {isShareModal == true
              ? 'Share to following user'
              : 'add transactions'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Heading size={'sm'} my={'2'} textAlign={'left'} fontSize={'sm'}>
              {' '}
              previosly you sahre account with{' '}
              {shareList &&
                shareList.sharedList.map((v) => {
                  return v.name + ',';
                })}
            </Heading>
            {loading == false && (
              <Select
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              >
                {shareList.users.map(
                  (user) =>
                    user.id !== sampleAccData.owner && (
                      <option value={user.email}>{user.name}</option>
                    )
                )}
              </Select>
            )}
          </ModalBody>
          <ModalFooter>
            <Stack direction={'row'}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleShareToUser}>Share</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex p={4} direction={'column'} gap={5}>
        <Stack
          direction={'row'}
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          {currentuserData &&
            sampleAccData.owner == currentuserData.user.id && (
              <Button
                onClick={handleShareAcc}
                colorScheme={useColorModeValue('blackAlpha', 'blue')}
              >
                Share Account
              </Button>
            )}
          <AddTranjection accId={id} fetchSignleAcc={fetchSignleAcc} />
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={5}
          my={3}
          justifyContent={'space-evenly'}
          alignItems={'center'}
        >
          <Stat boxShadow={'md'} p={2}>
            <StatLabel>Income</StatLabel>
            <StatNumber color={useColorModeValue('green', 'green.400')}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.income)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {transData.incomePercentageChange}%
            </StatHelpText>
          </Stat>
          <Stat
            boxShadow={'lg'}
            p={2}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <StatLabel>Total balance</StatLabel>
            <StatNumber color={useColorModeValue('blue.600', 'blue.400')}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.balance)}
            </StatNumber>
          </Stat>
          <Stat boxShadow={'md'} p={2}>
            <StatLabel>Expense</StatLabel>
            <StatNumber color={'red'}>
              {' '}
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.expenses)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {transData.expensePercentageChange}%
            </StatHelpText>
          </Stat>
        </Stack>
        {transData.data.length > 0 && (
          <Stack spacing={'8'}>
            <Button
              textTransform={'capitalize'}
              textAlign={'center'}
              color={useColorModeValue('black', 'black')}
              backgroundColor={'#ffe100'}
              _hover={{
                backgroundColor: '#ffeb57',
                color: 'black',
                boxShadow: 'lg',
              }}
              boxShadow="md"
              p="6"
              rounded="md"
              onClick={() => setChartVisibale(!chartVisible)}
            >
              view chart representation
            </Button>

            <Flex
              display={chartVisible ? 'flex' : 'none'}
              justifyContent={'center'}
              my={2}
              width={'100%'}
              alignItems={'center'}
              direction={'column'}
            >
              <Heading size={'md'} mb={3} textAlign={'center'}>
                previous income and expenss chart
              </Heading>
              <Box justifyContent={'center'} width={'80'}>
                <BalanceChart
                  income={transData.income}
                  expenses={transData.expenses}
                />
              </Box>
            </Flex>

            <Flex
              flexDirection={'column'}
              justifyContent={'center'}
              my={3}
              alignItems={'center'}
            >
              <Stack width={'full'}>
                <ApexTransactionChart
                  chartLable={intervalData == true ? chartLable1 : intLabelData}
                  chartData={intervalData == true ? chartData1 : intChartData}
                />
              </Stack>
              <Stack
                direction={'row'}
                my={2}
                spacing={4}
                justifyContent={'space-between'}
              >
                <Button onClick={handleLoadmore}>
                  <AddIcon />
                </Button>
                <Button onClick={handleLoadLess}>
                  <RepeatClockIcon />
                </Button>
                <Button onClick={handleLoadAllMore}>
                  <CheckCircleIcon />
                </Button>
                <Select onChange={handleSelectOption}>
                  <option value="Weeks">This Weeks</option>
                  <option value="Months">This Months</option>
                  <option value="Years">This Years</option>
                  <option value="All">All</option>
                </Select>
              </Stack>
            </Flex>
          </Stack>
        )}
        <TableContainer
          width={'100%'}
          my={2}
          px={{ base: 1, md: 3 }}
          overflowX={'auto'}
          ref={reportRef}
        >
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={transData.data}
              enableRowSelection
              positionToolbarAlertBanner="bottom"
              renderTopToolbarCustomActions={({ table }) => (
                <>
                  <Button onClick={() => setShowDownloadBtn(!showDownloadBtn)}>
                    {showDownloadBtn ? 'Hide' : 'Export'}
                  </Button>
                  {showDownloadBtn && (
                    <ExportData
                      setShowDownloadBtn={setShowDownloadBtn}
                      showDownloadBtn={showDownloadBtn}
                      table={table}
                      deleteTrans={deleteTrans}
                      handleExportData={handleExportData}
                      handleExportRows={handleExportRows}
                    />
                  )}
                </>
              )}
              enableEditing={true}
              editingMode="modal"
              onEditingRowSave={({ exitEditingMode, row, values }) => {
                // console.log('row', values);
                const user = localStorage.getItem('userInfo');
                const { token } = JSON.parse(user);
                const options = {
                  method: 'PUT',
                  url: `http://localhost:1337/editTransaction/${row.original.id}`,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: {
                    ...values,
                  },
                };
                axios
                  .request(options)
                  .then((response) => {
                    // console.log('log inside update--->', response);
                    if (response.status == 200) {
                      fetchSignleAcc();
                      toast({
                        title: 'Transaction Updated',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                      });
                      exitEditingMode();
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    toast({
                      title: `Transaction Not Updated, ${error.response.data.message}`,
                      status: 'error',
                      duration: 2000,
                      isClosable: true,
                    });
                    exitEditingMode();
                  });
              }}
            />
          </ThemeProvider>
        </TableContainer>
      </Flex>
    </MainTemplate>
  );
};
export async function getServerSideProps(context) {
  {
    const { query } = context;
    return {
      props: { id: query.id }, // will be passed to the page component as props
    };
  }
}

export default account;

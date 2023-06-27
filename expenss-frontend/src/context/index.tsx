'use client';
import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
  FormEvent,
} from 'react';
import {
  ChakraProvider,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createTheme } from '@mui/material';

const AuthContext = createContext<any>(null);
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState([]);

  const [searchResult, setSearchResult] = useState<any>();
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();
  const [rows, setRows] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chartData, setChartData] = useState([]);
  const [chartData1, setChartData1] = useState([]);
  const [intChartData, setIntChartData] = useState([]);
  const [intLabelData, setIntLabelData] = useState([]);
  const [chartLable, setChartLable] = useState([]);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [chartLable1, setChartLable1] = useState([]);
  const [email, setEmail] = useState('');
  const [sampleAccData, setSampleAccData] = useState();
  const [accPageLoading, setAccPageLoading] = useState(true);
  const [transData, setTransData] = useState();
  const [catData, setCatData] = useState()

  const fetchHomepageData = () => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);

    const options = {
      method: 'GET',
      url: 'http://localhost:1337/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
  };
  const getChartData = () => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    axios
      .get('http://localhost:1337/dahsboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        let tempData = res.data.listAllTransaction.map((transaction: any) => {
          return {
            close: transaction.amount,
            date: new Date(transaction.createdAt).toISOString(),
          };
        });
        console.log(tempData);
        setStock(tempData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteAcc = async (accID: any) => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'DELETE',
      url: `http://localhost:1337/delAccount/${accID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        if (response.status == 200) {
          setRefresh(!refresh);
          fetchHomepageData();
          toast({
            title: 'Account deleted successfully',
            variant: 'left-accent',
            status: 'success',
            duration: 3000,
          });
        } else {
          toast({
            title: 'Something went wrong',
            variant: 'left-accent',
            status: 'error',
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
  };

  const handleCreateAccount = async (
    e: FormEvent<HTMLFormElement>,
    closeBTN: any
  ) => {
    e.preventDefault();
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('accName'));

    const options = {
      method: 'POST',
      url: 'http://localhost:1337/addAccount',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: formData.get('accName'),
      },
    };
    await axios
      .request(options)
      .then((response) => {
        if (response.status == 201) {
          setRefresh(!refresh);
          fetchHomepageData();
          toast({
            title: 'Account created successfully',
            variant: 'left-accent',
            status: 'success',
            duration: 2000,
          });
          closeBTN();
        } else {
          toast({
            title: 'Account creation failed',
            variant: 'left-accent',
            status: 'error',
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
    return onClose();
  };

  const router = useRouter();

  const handleLogout = () => {
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    console.log(token);
    const options = {
      method: 'GET',
      url: 'http://localhost:1337/logout',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        Cookies.set('userInfo', '');
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 1000,
        });
        return router.push('/');
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `Something went wrong ${error.response.data.message}`,
          status: 'error',
          duration: 1000,
        });
      });
  };
  const handleSearch = (searchData: string) => {
    if (searchData === '') {
      return setSearchResult(null);
    }
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    // console.log(token);
    const options = {
      method: 'POST',
      url: 'http://localhost:1337/searchTransaction',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        searchTerm: searchData,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `Something went wrong ${error.response.data.message}`,
          status: 'error',
          duration: 1000,
        });
      });
  };
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const config = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    console.log(config);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, config)
      .then((response) => {
        Cookies.set('userInfo', JSON.stringify(response.data.data));
        router.push('/');
        toast({
          title: 'login sucess',
          variant: 'left-accent',
          status: 'success',
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (Cookies.get('userInfo') == '' || Cookies.get('userInfo') == undefined)
      return router.replace('/auth/login');
  }, []);
  const { colorMode } = useColorMode();
  const theme = createTheme({
    palette: { mode: colorMode },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
          },
        },
      },
    },
  });

  const fetchAccData = (id:string) => {
    const { token } = JSON.parse(Cookies.get("userInfo") as any);
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
  const fetchSignleAcc = (id:string) => {
    const { token } = JSON.parse(Cookies.get("userInfo") as any);
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
        setTransData(response.data);
      setRows(response.data.data);
        const newArr = response.data.data.map((element:any) => {
          return parseFloat(element.amount);
        });
        const newLablelArr = response.data.data.map((element:any) => {
          return new Date(element.createdAt).toDateString();
        });
        setChartData(newArr);
        setChartLable(newLablelArr);
        setAccPageLoading(false);
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

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          theme,
          handleLogout,
          handleSearch,
          handleCreateAccount,
          refresh,
          setRefresh,
          data,
          fetchHomepageData,
          handleDeleteAcc,
          handleLogin,
          fetchSignleAcc,
          fetchAccData,catData, setCatData, accPageLoading, setAccPageLoading, transData, sampleAccData, rows, setRows
        }}
      >
        {children}
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export const dataState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;

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
  extendTheme,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createTheme } from '@mui/material';

const AuthContext = createContext<any>(null);
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<any>();
  const [data, setData] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();
  const [rows, setRows] = useState();
  const [shareLoading, setShareLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartDataA, setChartDataA] = useState([]);
  const [chartDataB, setChartDataB] = useState([]);
  const [chartLable, setChartLable] = useState([]);
  const [sampleAccData, setSampleAccData] = useState();
  const [accPageLoading, setAccPageLoading] = useState(true);
  const [transData, setTransData] = useState();
  const [catData, setCatData] = useState();
  const [shareList, setShareList] = useState<any>();
  const [shareAccList, setShareAccList] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [income, setIncome] = useState<number>();
  const [expenses, setExpenses] = useState<number>();
  const [balance, setBalance] = useState<number>();
  const [chartLableD, setChartLableD] = useState([]);
  const [chartDataD, setChartDataD] = useState([]);
  const [chartDataI, setChartDataI] = useState([]);
  const [listIncome, setListIncome] = useState([]);
  const [listBalance, setListBalance] = useState([]);
  const [currentuserData, setCurrentuserData] = useState<any>();
  const [signleUser, setSignleUser] = useState<any>();
  const [chartVisible, setChartVisibale] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [catIncExp, setCatIncExp] = useState<any>();
  const [importfile, setImportfile] = useState<any>();
  const [importingLoading, setImportingLoading] = useState(false);

  const router = useRouter();

  const { colorMode } = useColorMode();
  const theme = createTheme({
    palette: { mode: colorMode },
  });
  const fetchIMPData = async () => {
    if (Cookies.get('userInfo') == '' || Cookies.get('userInfo') == undefined) {
      return router.replace('/auth/login');
    } else {
      setCurrentuserData(JSON.parse(Cookies.get('userInfo') as any));
      await fetchHomepageData();
    }
  };

  useEffect(() => {
    fetchIMPData();
  }, []);

  const handleImportFileChange = async (event: any) => {
    const file = event.target.files[0];
    setImportfile(file);
  };
  const handleImportFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImportingLoading(true);
    const formData = new FormData(event.currentTarget);
    const accountId = formData.get('account');
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as string);
    formData.append('file', importfile!);
    const config = {
      url: `${process.env.NEXT_PUBLIC_API_URL}/import/transaction/${accountId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Add the Content-Type header
      },
      method: 'POST',
      data: formData,
    };
    await axios
      .request(config)
      .then((res) => {
        console.log(res);
        setImportingLoading(false);
        toast({
          title: res.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        toast({
          title: res.data.rejectedRowCount,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        setImportingLoading(false);
        return toast({
          title: err.response.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'cxciup5w');
      const respose = await axios.post(
        'https://api.cloudinary.com/v1_1/dyb6dkjju/image/upload',
        formData
      );
      Cookies.set('profileUrl', respose.data.secure_url);
      setProfileUrl(respose.data.secure_url);
    } else {
      setProfileUrl('');
    }
  };
  const getTransByCategorys = async () => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as string);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/transaction/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCatIncExp(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCatData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/category`)
      .then((res) => {
        setCatData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDashboardData = () => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as string);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dahsboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAnalytics(res.data);
        setDashboardLoading(false);
        let tempIncome = 0;
        let tempExpenses = 0;
        let tempBalance = 0;
        res.data.analyticsData.map(
          (account: { income: number; expense: number; balance: number }) => {
            tempIncome += account.income;
            tempExpenses += account.expense;
            tempBalance += account.balance;
          }
        );
        setIncome(tempIncome);
        setExpenses(tempExpenses);
        setBalance(tempBalance);
        setChartLableD(
          res.data.listAllTransaction.map(
            (transaction: { createdAt: string | number | Date }) => {
              return transaction.createdAt;
            }
          )
        );
        setListBalance(
          res.data.analyticsData.map((account: { balance: any }) => {
            return account.balance;
          })
        );
        setListIncome(
          res.data.analyticsData.map(
            (account: {
              account: any;
              balance: number;
              income: number;
              expense: any;
            }) => {
              return `Account: ${
                account.account.name
              }, I/E/B: ${account.income.toFixed(2)}, ${account.expense.toFixed(
                2
              )}, ${account.balance.toFixed(2)}`;
            }
          )
        );
        setChartDataD(
          res.data.listAllTransaction.map((transaction: { amount: any }) => {
            return transaction.amount;
          })
        );
        setChartDataI(
          res.data.listAllTransaction.map(
            (transaction: { amount: any; isIncome: boolean }) => {
              return {
                amount: transaction.amount,
                isIncome: transaction.isIncome,
              };
            }
          )
        );
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const getRecievedAcc = () => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/sharedAcc`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response.data);
        setShareAccList(response.data);
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

  const getUserName = (userId: string) => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setSignleUser(response.data);
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

  const fetchHomepageData = () => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);

    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setData(response.data);
        return setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        return toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
  };

  const handleDeleteAcc = async (accID: any) => {
    const user: any = Cookies.get('userInfo');
    const { token } = JSON.parse(user);
    const options = {
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_API_URL}/delAccount/${accID}`,
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

    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/addAccount`,
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
  };

  const handleLogout = () => {
    const { token } = JSON.parse(Cookies.get('userInfo') as any);

    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        Cookies.set('userInfo', '');
        setShareAccList(null);
        setData(null);
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 1000,
        });
        return router.replace('/auth/login');
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
    if (searchData.trim() === '') {
      return setSearchResult(null);
    }
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/searchTransaction`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        searchTerm: searchData.trim(),
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
    setLoginLoading(true);
    const formData = new FormData(e.currentTarget);
    const config = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, config)
      .then((response) => {
        setLoginLoading(false);
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
        setLoginLoading(false);
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          isClosable: true,
        });
      });
  };

  const fetchAccData = (id: string) => {
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/editAccount/${id}`,
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
  const fetchSignleAcc = (id: string) => {
    const { token } = JSON.parse(Cookies.get('userInfo') as any);
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/viewTransaction/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setTransData(response.data);
        setRows(response.data.data);
        const newArr = response.data.data.map((element: any) => {
          return {
            x: element.createdAt,
            y: parseFloat(element.amount),
          };
        });
        const newArr3 = response.data.data.map((element: any) => {
          return parseFloat(element.amount);
        });
        const newArr2 = response.data.data.map((element: any) => {
          return {
            amount: parseFloat(element.amount),
            isIncome: element.isIncome,
          };
        });
        const newLablelArr = response.data.data.map((element: any) => {
          return new Date(element.createdAt).toDateString();
        });
        setChartData(newArr3);
        setChartDataB(newArr);
        setChartDataA(newArr2);
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

  // Email format validation
  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePasswordStrength = (password: any) => {
    const minLength = 8;

    // Check for at least one lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
      return false;
    }

    // Check for at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return false;
    }

    // Check for at least one digit
    const digitRegex = /\d/;
    if (!digitRegex.test(password)) {
      return false;
    }

    // Check for at least one special character
    const specialCharRegex = /[!@#$%^&*]/;
    if (!specialCharRegex.test(password)) {
      return false;
    }

    return password.length >= minLength;
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const signupData = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      profile: profileUrl,
    };

    if (!validateEmail(signupData.email)) {
      toast({
        title: 'Invalid email format',
        variant: 'left-accent',
        status: 'error',
        duration: 4000,
      });
      return;
    } else if (!validatePasswordStrength(signupData.password)) {
      toast({
        title:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        variant: 'left-accent',
        status: 'error',
        duration: 5000,
      });
      return;
    } else {
      setSignupLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, signupData)
        .then((response) => {
          if (response.status == 200) {
            setSignupLoading(false);
            toast({
              title: 'signup sucess',
              variant: 'left-accent',
              status: 'success',
              isClosable: true,
            });
            router.push('/auth/login');
          }
        })
        .catch((error) => {
          setSignupLoading(false);
          console.log(error);
          toast({
            title: error.response.data.message,
            variant: 'left-accent',
            status: 'error',
            isClosable: true,
          });
        });
    }
  };

  const handleTransUpdate = (id: string, values: any) => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    const options = {
      method: 'PUT',
      url: `${process.env.NEXT_PUBLIC_API_URL}/editTransaction/${id}`,
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
        if (response.status == 200) {
          fetchSignleAcc(values.account);
          toast({
            title: 'Transaction Updated',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
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
      });
  };

  const deleteTrans = (tId: string, accId: string) => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/rmTransaction/${tId}`, {
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
        fetchSignleAcc(accId);
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

  const handleCreateTrans = (
    e: FormEvent<HTMLFormElement>,
    accId: string,
    setOpen: any
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      text: formData.get('text'),
      amount: formData.get('amount'),
      transfer: formData.get('transfer'),
      category: formData.get('category'),
      isIncome: formData.get('isIncome'),
    };

    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/addTransaction/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    axios
      .request(options)
      .then((response) => {
        fetchSignleAcc(accId);
        if (response.status == 201) {
          fetchSignleAcc(accId);
          toast({
            title: 'Transaction created successfully',
            status: 'success',
            duration: 1000,
            isClosable: true,
          });
          setOpen(false);
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `${error.response.data.message}`,
          status: 'error',
          duration: 1000,
        });
      });
  };

  const updateAccData = (
    e: FormEvent<HTMLFormElement>,
    accId: string,
    onCloseD: any
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const balance = formData.get('balance');
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    const options = {
      method: 'PUT',
      url: `${process.env.NEXT_PUBLIC_API_URL}/editAccount/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        balance: balance,
      },
    };
    axios
      .request(options)
      .then((response) => {
        fetchHomepageData();
        toast({
          title: 'Account updated successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        fetchSignleAcc(accId);
        return onCloseD();
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

  const handleShareAcc = (
    e: FormEvent<HTMLFormElement>,
    id: string,
    onCloseD: any
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/account/share/${id}`,
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
        if (response.status == 200) {
          onCloseD();
          toast({
            title: 'Share Successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          fetchSignleAcc(id);
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

  const getShareList = (id: string, onOpenD: any) => {
    onOpenD();
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user as any);
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setShareLoading(false);
        setShareList(response.data);
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

  const chkraTheme = extendTheme({
    colors: {
      dark: {
        50: '#f5f5f5',
        100: '#e0e0e0',
        200: '#bdbdbd',
        300: '#9e9e9e',
        400: '#757575',
        500: '#616161',
        600: '#424242',
        700: '#303030',
        800: '#212121',
        900: '#000000', // Pitch black color
      },
      gray: {
        50: '#fafafa',
        100: '#f2f2f2',
        200: '#cccccc',
        300: '#b3b3b3',
        400: '#999999',
        500: '#808080',
        600: '#666666',
        700: '#4d4d4d',
        800: '#333333',
        900: '#0f0f0f', // Darkest shade of black
      },
      amazingLight: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#D3DCE3',
        400: '#A5B4C4',
        500: '#7784A6',
        600: '#657198',
        700: '#4D5A7B',
        800: '#3B4664',
        900: '#29324D',
      },
    },
    styles: {
      global: {
        body: {
          bg: 'dark.900', // Set the background color to the custom pitch black color
        },
      },
    },
  });

  return (
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
        fetchAccData,
        catData,
        setCatData,
        accPageLoading,
        setAccPageLoading,
        transData,
        sampleAccData,
        rows,
        setRows,
        searchResult,
        handleSignup,
        handleTransUpdate,
        handleCreateTrans,
        deleteTrans,
        handleShareAcc,
        chartLable,
        chartData,
        updateAccData,
        shareList,
        shareLoading,
        getShareList,
        getDashboardData,
        listBalance,
        listIncome,
        chartDataD,
        chartLableD,
        balance,
        expenses,
        income,
        dashboardLoading,
        analytics,
        getCatData,
        currentuserData,
        setCurrentuserData,
        chartVisible,
        setChartVisibale,
        chartDataI,
        chartDataA,
        loginLoading,
        signupLoading,
        chartDataB,
        loading,
        shareAccList,
        getRecievedAcc,
        signleUser,
        getUserName,
        setSignleUser,
        profileUrl,
        handleFileChange,
        getTransByCategorys,
        catIncExp,
        handleImportFile,
        handleImportFileChange,
        importfile,
        importingLoading,
      }}
    >
      <ChakraProvider theme={chkraTheme}>{children}</ChakraProvider>
    </AuthContext.Provider>
  );
};

export const dataState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;

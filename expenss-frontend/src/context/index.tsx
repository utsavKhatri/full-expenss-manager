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
import { redirect, useRouter } from 'next/navigation';
import { createTheme } from '@mui/material';
import {
  customThemeData,
  fetchAPI,
  validateEmail,
  validatePasswordStrength,
} from '@/utils';

const AuthContext = createContext<any>(null);
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<any>();
  const [data, setData] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const toast = useToast();
  const [rows, setRows] = useState();
  const [shareLoading, setShareLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartDataA, setChartDataA] = useState<any[]>([]);
  const [chartDataB, setChartDataB] = useState<any[]>([]);
  const [chartLable, setChartLable] = useState<any[]>([]);
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

  const myToast = ({
    message,
    isSuccess = true,
    isInfo = false,
  }: {
    message: any;
    isSuccess?: boolean;
    isInfo?: boolean;
  }) => {
    return toast({
      title: message,
      status: isInfo ? 'info' : isSuccess ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

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
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      data: formData,
    };
    await axios
      .request(config)
      .then((res) => {
        console.log(res);
        setImportingLoading(false);
        myToast({
          message: res.data.message,
        });
        myToast({
          isInfo: true,
          message: res.data.rejectedRowCount,
        });
      })
      .catch((err) => {
        console.log(err);
        setImportingLoading(false);
        return myToast({
          isSuccess: false,
          message: err.response.data.message,
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
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/transaction/category`,
      });
      setCatIncExp(data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const getCatData = async () => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/category`,
      });
      setCatData(data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const getDashboardData = async () => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/dahsboard`,
      });

      setAnalytics(data);

      const { analyticsData, listAllTransaction } = data;

      const totalIncome = analyticsData.reduce(
        (sum: any, account: { income: any }) => sum + account.income,
        0
      );
      const totalExpenses = analyticsData.reduce(
        (sum: any, account: { expense: any }) => sum + account.expense,
        0
      );
      const totalBalance = analyticsData.reduce(
        (sum: any, account: { balance: any }) => sum + account.balance,
        0
      );

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setBalance(totalBalance);

      setChartLableD(
        listAllTransaction.map(
          (transaction: { createdAt: any }) => transaction.createdAt
        )
      );
      setListBalance(
        analyticsData.map((account: { balance: any }) => account.balance)
      );
      setListIncome(
        analyticsData.map(
          (account: { account: { name: any } }) => account.account.name
        )
      );
      setChartDataD(
        listAllTransaction.map(
          (transaction: { amount: any }) => transaction.amount
        )
      );
      setChartDataI(
        listAllTransaction.map(
          (transaction: { amount: any; isIncome: any }) => ({
            amount: transaction.amount,
            isIncome: transaction.isIncome,
          })
        )
      );

      setDashboardLoading(false);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const getRecievedAcc = async () => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/sharedAcc`,
      });
      setShareAccList(data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const getUserName = async (userId: string) => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
      });
      setSignleUser(data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const fetchHomepageData = async () => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/`,
      });
      setData(data);
      return setLoading(false);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const handleDeleteAcc = async (accID: any) => {
    try {
      await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/delAccount/${accID}`,
        method: 'DELETE',
      });

      setRefresh(!refresh);
      fetchHomepageData();
      myToast({
        message: 'Account deleted successfully',
      });
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const handleCreateAccount = async (
    e: FormEvent<HTMLFormElement>,
    closeBTN: any
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      await fetchAPI({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/addAccount`,
        body: {
          name: formData.get('accName'),
        },
      });
      setRefresh(!refresh);
      fetchHomepageData();
      myToast({
        message: 'Account created successfully',
      });
      closeBTN();
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      });
      Cookies.set('userInfo', '');
      setShareAccList(null);
      setData(null);
      myToast({
        message: 'Logged out successfully',
      });
      return router.replace('/auth/login');
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };
  const handleSearch = async (searchData: string) => {
    try {
      if (searchData.trim() === '') {
        return setSearchResult(null);
      }

      const response = await fetchAPI({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/searchTransaction`,
        body: {
          searchTerm: searchData.trim(),
        },
      });

      setSearchResult(response);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      const formData = new FormData(e.currentTarget);

      const data = await fetchAPI({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/login`,
        body: {
          email: formData.get('email'),
          password: formData.get('password'),
        },
        isOpen: true,
      });
      setLoginLoading(false);
      Cookies.set('userInfo', JSON.stringify(data.data));
      router.push('/');
      myToast({
        message: 'Logged in successfully',
      });
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const fetchAccData = async (id: string) => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/editAccount/${id}`,
      });
      setSampleAccData(data.data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
      redirect('/');
    }
  };

  const fetchSignleAcc = async (id: string) => {
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/viewTransaction/${id}`,
      });

      setTransData(data);
      setRows(data.data);

      const newArr = data.data.map((element: any) => ({
        x: element.createdAt,
        y: parseFloat(element.amount),
      }));

      const newArr2 = data.data.map((element: any) => ({
        amount: parseFloat(element.amount),
        isIncome: element.isIncome,
      }));

      const newLabelArr = data.data.map((element: any) =>
        new Date(element.createdAt).toDateString()
      );

      setChartData(data.data.map((element: any) => parseFloat(element.amount)));
      setChartDataB(newArr);
      setChartDataA(newArr2);
      setChartLable(newLabelArr);

      setAccPageLoading(false);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
      redirect('/');
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
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
      try {
        setSignupLoading(true);
        await fetchAPI({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_API_URL}/signup`,
          body: signupData,
          isOpen: true,
        });
        setSignupLoading(false);
        myToast({
          message: 'User registered successfully',
        });
        router.push('/auth/login');
      } catch (error: any) {
        setSignupLoading(false);
        console.log(error);
        myToast({
          isSuccess: false,
          message: error.response.data.message,
        });
      }
    }
  };

  const handleTransUpdate = async (id: string, values: any) => {
    try {
      await fetchAPI({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/editTransaction/${id}`,
        body: values,
      });
      fetchSignleAcc(values.account);
      myToast({
        message: 'Transaction Updated Successfully',
      });
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: "Transaction couldn't be updated",
      });
    }
  };

  const deleteTrans = async (tId: string, accId: string) => {
    try {
      await fetchAPI({
        method: 'DELETE',
        url: `${process.env.NEXT_PUBLIC_API_URL}/rmTransaction/${tId}`,
      });
      myToast({
        message: 'Transaction deleted successfully',
      });
      fetchSignleAcc(accId);
    } catch (error: any) {
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const handleCreateTrans = async (
    e: FormEvent<HTMLFormElement>,
    accId: string,
    setOpen: any
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        text: formData.get('text'),
        amount: formData.get('amount'),
        transfer: formData.get('transfer'),
        category: formData.get('category'),
        isIncome: formData.get('isIncome'),
      };

      await fetchAPI({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/addTransaction/${accId}`,
        body: data,
      });
      fetchSignleAcc(accId);
      myToast({
        message: 'Transaction created successfully',
      });
      setOpen(false);
    } catch (error: any) {
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const updateAccData = async (
    e: FormEvent<HTMLFormElement>,
    accId: string,
    onCloseD: any
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const balance = formData.get('balance');

      await fetchAPI({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/editAccount/${accId}`,
        body: {
          balance: balance,
        },
      });
      fetchHomepageData();
      myToast({
        message: 'Account updated successfully',
      });
      fetchSignleAcc(accId);
      return onCloseD();
    } catch (error: any) {
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const handleShareAcc = async (
    e: FormEvent<HTMLFormElement>,
    id: string,
    onCloseD: any
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email');

      await fetchAPI({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/account/share/${id}`,
        body: {
          email: email,
        },
      });
      onCloseD();
      myToast({
        message: 'Account shared successfully',
      });
      fetchSignleAcc(id);
    } catch (error: any) {
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const getShareList = async (id: string, onOpenD: any) => {
    onOpenD();
    try {
      const data = await fetchAPI({
        url: `${process.env.NEXT_PUBLIC_API_URL}/share/${id}`,
      });
      setShareLoading(false);
      setShareList(data);
    } catch (error: any) {
      console.log(error);
      myToast({
        isSuccess: false,
        message: error.response.data.message,
      });
    }
  };

  const chkraTheme = extendTheme(customThemeData);

  return (
    <AuthContext.Provider
      value={{
        theme,
        chartDataI,
        chartDataA,
        loginLoading,
        signupLoading,
        chartDataB,
        loading,
        data,
        shareAccList,
        refresh,
        catData,
        accPageLoading,
        transData,
        sampleAccData,
        rows,
        searchResult,
        chartLable,
        chartData,
        shareList,
        shareLoading,
        listBalance,
        listIncome,
        chartDataD,
        chartLableD,
        balance,
        expenses,
        income,
        dashboardLoading,
        analytics,
        currentuserData,
        chartVisible,
        signleUser,
        profileUrl,
        catIncExp,
        importfile,
        importingLoading,
        handleLogout,
        handleSearch,
        handleCreateAccount,
        setRefresh,
        fetchHomepageData,
        handleDeleteAcc,
        handleLogin,
        fetchSignleAcc,
        fetchAccData,
        setCatData,
        setAccPageLoading,
        setRows,
        handleSignup,
        handleTransUpdate,
        handleCreateTrans,
        deleteTrans,
        handleShareAcc,
        updateAccData,
        getShareList,
        getDashboardData,
        getCatData,
        setCurrentuserData,
        setChartVisibale,
        getRecievedAcc,
        getUserName,
        setSignleUser,
        handleFileChange,
        getTransByCategorys,
        handleImportFile,
        handleImportFileChange,
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

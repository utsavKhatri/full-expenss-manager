'use client';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = ({ searchParams }: { searchParams: any }) => {
  const { code } = searchParams;
  const router = useRouter();
  const toast = useToast();

  const testToken = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`
      )
      .then((res) => {
        console.log(res.data);
        Cookies.set('userInfo', JSON.stringify(res.data.data));
        router.push('/');
        return toast({
          title: 'Logged in successfully',
          status: 'success',
          duration: 1000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        router.push('/auth/login');
      });
  };

  useEffect(() => {
    testToken();
  }, []);

  return <div>...loading</div>;
};

export default page;

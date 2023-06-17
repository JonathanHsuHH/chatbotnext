import React, { useEffect } from "react";

import { SignIn } from "../components/SignIn";
import { authVerify } from "../utils/LoginUtils";
import { useRouter } from 'next/router';

function Login() {
  const router = useRouter();

  useEffect(() => {
      // redirect to home if already logged in
      if (authVerify()) {
          router.push('/');
      }
  }, [router]);
  
  return (
    <SignIn/>
  )
}

export default Login
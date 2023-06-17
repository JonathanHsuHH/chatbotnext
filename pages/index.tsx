import React, { useEffect, useState } from "react";

import { MainFrame } from '../components/MainFrame'
import { authVerify } from "../utils/LoginUtils";
import { useRouter } from 'next/router';

function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // redirect to login if fail to verify
        if (!authVerify()) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (!loading) {
        return (
            <MainFrame/>
        )
    }
}

export default Home
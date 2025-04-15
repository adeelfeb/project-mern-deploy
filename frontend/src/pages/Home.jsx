import React, {  useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import LandingPage from './home/LandingPage';




function Home() {
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

    useEffect(() => {
        if (authStatus && user) {
            navigate('/dashboard');
        }
    }, [authStatus, user, navigate]);

    return(
        <>
        <LandingPage/>
        </>
    )

    
}

export default Home;
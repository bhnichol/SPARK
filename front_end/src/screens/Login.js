import { useLocation, useNavigate } from 'react-router';
import API_URL from '../api/api'
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Divider, FormControlLabel, ThemeProvider, Typography, Link } from '@mui/material';
import { AppTheme } from '../theme';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [email, resetEmail, EmailAttribs] = useInput('email', '')
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);
    const buttonStyle = "border rounded-sm ml-[30px] mr-[30px] m-[10px] text-2xl text-black p-[5px]"
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL.AUTH.LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            const accessToken = response?.data?.accessToken;
            setAuth({ email, accessToken });
            setPwd('');
            resetEmail();
            setError('');
            navigate(from, { replace: true });
        } catch (err) {
            console.log(err)
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setError('Incorrect Email or Password');
            } else {
                setError('Login Failed');
            }
        }

    }
    useEffect(()=>{
        setError('');
    }, [email, pwd])

    return (
        <ThemeProvider theme={AppTheme}>
            <div className='flex flex-col items-center place-content-center h-[100vh] w-full bg-[radial-gradient(circle,rgba(26,26,29,1)_0%,rgba(59,28,50,1)_0%,rgba(26,26,29,1)_100%)] content-center'>
                <div className='flex flex-col items-center w-[70%] min-h-[50%] md:w-[30%] md:min-h-[65%] p-[20px] md:p-[5px] bg-[#1A1A1D] rounded-md shadow-lg border-[2px] border-[#222222] text-white'>
                    <div className='text-3xl pt-[30px] justify-self-start flex pb-[70px]'>Sign in</div>
                    <div className='flex flex-col w-full'>
                        {error ? <div className='bg-[#222222] ml-[30px] mr-[30px] mb-[15px] rounded-md border-red-500 border'><Typography color='error' className='pl-[10px]'>{error}</Typography></div> : <></>}
                        <h1 className='ml-[30px] text-2xl'>Email</h1>
                        <input type="text" id="email" placeholder='email@example.com'{...EmailAttribs} className={buttonStyle}></input>
                        <h1 className='ml-[30px] text-2xl'>Password</h1>
                        <input type="password" id="pwd" value={pwd} placeholder='********' className={buttonStyle} onChange={(e) => setPwd(e.target.value)}></input>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" onChange={toggleCheck} checked={check} />}
                            label="Remember me"
                            sx={{ paddingLeft: '5%' }}
                        />
                        <Button variant='contained' className='w-[100px] self-center' onClick={(e) => handleRegister(e)}>Sign In</Button>


                        <div className='flex items-center flex-col pt-[30px]'>
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                                className='text-[#A64D79]'
                            >
                                Forgot your password?
                            </Link>
                            <Divider sx={{
                                "&::before, &::after": {
                                    borderColor: "white",
                                },
                            }}>or</Divider>
                            <div>
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/register"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                    className='text-[#A64D79]'
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}
export default Login;
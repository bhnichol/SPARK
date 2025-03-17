import API_URL from '../api/api'
import axios from '../api/axios';
import { useEffect, useState } from 'react';
import { Button, Divider, ThemeProvider, Typography, Link } from '@mui/material';
import { AppTheme } from '../theme';

const Register = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
    const lengthRegex = /^.{8,}$/;
    const varRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9])\S+$/;
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdConfirm, setPwdConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const buttonStyle = "border rounded-sm ml-[30px] mr-[30px] m-[10px] text-2xl text-black p-[5px]"
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!ValidateInputs(e)) {
            e.preventDefault();
            return;
        }
        try {
            const response = await axios.post(API_URL.AUTH.REGISTER_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setError('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) { setError('No Server Response') }
            else if (err.response?.status === 409) {
                setError('Email Taken');
            } else {
                setError('Registration Failed')
            }
        }

    }

    const ValidateInputs = (e) => {
        if(varRegex.test(pwd) && lengthRegex.test(pwd) && pwd === pwdConfirm && emailRegex.test(email)) return true;
        return false;
    }

    useEffect(() => {
        if(!success) {
        if (email === '' || !email) {
            document.getElementById('emailCheck').style.borderColor = "white";
            document.getElementById('validEmail').style.color = "white";
        }
        else if (emailRegex.test(email)) {
            document.getElementById('emailCheck').style.borderColor = "green";
            document.getElementById('validEmail').style.color = "green";
        }
        else {
            document.getElementById('emailCheck').style.borderColor = "red";
            document.getElementById('validEmail').style.color = "red";
        }

        if (pwd === '' && pwdConfirm === '') {
            document.getElementById('pwdCheck').style.borderColor = "white";
            document.getElementById('lengthCheck').style.color = "white";
            document.getElementById('varCheck').style.color = "white";
            document.getElementById('confirmCheck').style.color = "white";
        }
        else {

            if (lengthRegex.test(pwd)) {
                document.getElementById('lengthCheck').style.color = "green";
            }
            else {
                document.getElementById('lengthCheck').style.color = "red";
            }

            if (varRegex.test(pwd)) {
                document.getElementById('varCheck').style.color = "green";
            }
            else {
                document.getElementById('varCheck').style.color = "red";
            }

            if (pwd === pwdConfirm && pwd !== '' && pwdConfirm !== '') {
                document.getElementById('confirmCheck').style.color = "green";
            }
            else {
                document.getElementById('confirmCheck').style.color = "red";
            }

            if (varRegex.test(pwd) && lengthRegex.test(pwd) && pwd === pwdConfirm) {
                document.getElementById('pwdCheck').style.borderColor = "green";
            }
            else {
                document.getElementById('pwdCheck').style.borderColor = "red";
            }
        }
    }

    }, [email, pwd, pwdConfirm])

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePwdChange = async (e) => {
        setPwd(e.target.value);
    }

    return (
        <ThemeProvider theme={AppTheme}>
            <div className='flex flex-col items-center place-content-center h-[100vh] w-full bg-[radial-gradient(circle,rgba(26,26,29,1)_0%,rgba(59,28,50,1)_0%,rgba(26,26,29,1)_100%)] content-center'>
            <div className='flex flex-col items-center w-[70%]  md:w-[30%]  p-[20px] md:p-[5px] bg-[#1A1A1D] rounded-md shadow-lg border-[2px] border-[#222222] text-white'>
                  {success ?
                    <div>
                    <div className='text-2xl pt-[30px] justify-self-start flex pb-[70px] p-[20px]'>Successfully created account!</div>
                    <div className='justify-self-center p-[20px]'>
                                Click here to login!{' '}
                                <Link
                                    href="/login"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                    className='text-[#A64D79]'
                                >
                                    Sign In
                                </Link>
                            </div>
                    </div>
                   : <div>
                  <div className='text-3xl pt-[30px] justify-self-start flex pb-[70px]'>Sign Up</div>
                    <div className='flex flex-col w-full'>
                    {error ? <div className='bg-[#222222] ml-[30px] mr-[30px] mb-[15px] rounded-md border-red-500 border'><Typography color='error' className='pl-[10px]'>{error}</Typography></div> : <></>}
                        <h1 className='ml-[30px] text-2xl'>Email</h1>
                        <input type="text" id="email" placeholder='email@example.com' onChange={async (e) => handleEmailChange(e)} className={buttonStyle}></input>
                        <div className='bg-[#222222] ml-[30px] mr-[30px]  mb-[15px]'>
                            <ul id='emailCheck' className='list-disc pl-[30px] rounded-md border'>
                                <li id='validEmail'> Valid email address </li>
                            </ul>
                        </div>
                        <h1 className='ml-[30px] text-2xl'>Password</h1>
                        <input type="password" id="pwd" value={pwd} placeholder='********' className={buttonStyle} onChange={(e) => handlePwdChange(e)}></input>
                        <h1 className='ml-[30px] text-2xl'>Confirm Password</h1>
                        <input type="password" id="pwd_confirm" value={pwdConfirm} placeholder='********' className={buttonStyle} onChange={(e) => setPwdConfirm(e.target.value)}></input>
                        <div className='bg-[#222222] ml-[30px] mr-[30px] mb-[15px]'>
                            <ul id='pwdCheck' className='list-disc pl-[30px] rounded-md border'>
                                <li id='lengthCheck'> Have a length of 8 characters</li>
                                <li id='varCheck'> Contain a capitol letter, number, and special character</li>
                                <li id='confirmCheck'> Confirm password matches</li>
                            </ul>
                        </div>
                        


                        <Button variant='contained' className='w-[100px] self-center' onClick={(e) => handleRegister(e)}>Sign Up</Button>


                        <div className='flex items-center flex-col pt-[30px]'>
                            <Divider sx={{
                                "&::before, &::after": {
                                    borderColor: "white",
                                },
                            }}>or</Divider>
                            <div>
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                    className='text-[#A64D79]'
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                    </div>}
                </div>
            </div>
        </ThemeProvider>
    )
}
export default Register;
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/appLogo.svg'
import lock from '../../assets/images/Lock.svg'
import message from '../../assets/images/Message.svg'
import './login.css'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'sonner'
import { apiInstance } from '../../API/apiBaseURL'
import Swal from 'sweetalert2'
import { type } from '@testing-library/user-event/dist/type'
import Loader from '../Loader/Loader'

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch } = useForm();
    const emailValue = watch("email");
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await axios.post(`https://demo.iroidsolutions.com:3004/api/v1/auth/login`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then((res) => {
                if (res.status === 200) {
                    const token = res.data.data.auth.accessToken;
                    localStorage.setItem("token", token);
                    toast.success("Login Successfully!!", res.data.message);
                    navigate("home");
                } else {
                    toast.error();
                }
            })
        } catch (error) {
            toast.error("Error: Invalid response format", error);
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        setIsLoading(true)

        try {
            await apiInstance.post('users/forgot-password', {
                email: emailValue,
                type: 2
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then((res) => {
                if (res.status === 200) {
                    toast.success("OTP sent successfully!");
                    Swal.fire({
                        title: "Enter OTP",
                        text: "Please enter the 4-digit OTP sent to your email",
                        icon: "info",
                        html: `
                                        <div class="otp-container">
                                            <input type="text" maxlength="1" class="otp-input" autofocus>
                                            <input type="text" maxlength="1" class="otp-input">
                                            <input type="text" maxlength="1" class="otp-input">
                                            <input type="text" maxlength="1" class="otp-input">
                                        </div>
                                    `,
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Verify OTP",
                        didOpen: () => {
                            const inputs = document.querySelectorAll('.otp-input');
                            inputs.forEach((input, index) => {
                                input.addEventListener('input', function () {
                                    if (this.value.length === 1) {
                                        if (index < inputs.length - 1) {
                                            inputs[index + 1].focus();
                                        }
                                    }
                                });
                                input.addEventListener('keydown', function (e) {
                                    if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                                        inputs[index - 1].focus();
                                    }
                                });
                            });
                        }
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const otp = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');

                            try {
                                await handleOTP({ otp, email: emailValue, type: 2 });
                                Swal.fire({
                                    title: "OTP Verified!",
                                    text: "Your Can Change Your Password",
                                    icon: "success"
                                });
                                navigate("change-password", { state: { email: emailValue } });
                            } catch (error) {
                                Swal.fire({
                                    title: "OTP Verification Failed",
                                    text: "Please try again.",
                                    icon: "error"
                                });
                            }
                        }
                    });
                } else {
                    toast.error("Failed to resend OTP. Please try again.");
                }

            })
        } catch (error) {
            toast.error(error.data.message);
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    const handleOTP = async (data) => {
        setIsLoading(true)
        try {
            const payload = {
                otp: data.otp,
                email: emailValue,
                type: 2
            };

            const response = await apiInstance.post(`auth/verify-otp`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                return response.data;
            } else {
                throw new Error('OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                toast.error(`OTP verification failed: ${error.response.data.message || 'Please try again.'}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from server. Please try again.');
            } else {
                console.error('Error message:', error.message);
                toast.error('An error occurred. Please try again.');
            }
            throw error;
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            {isLoading ? <Loader /> : (
                <div className="wrapper d-flex align-items-center">
                    <form className="form-signin col-md-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="app-logo d-flex justify-content-center">
                            <img src={logo} alt="" />
                        </div>
                        <h1 className="form-signin-heading text-center mt-2">Hello!</h1>
                        <p className="text-center mb-4 text-white">Login to your account</p>
                        <div className="inner-addon mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                {...register('email', { required: 'Email is required' })}
                                placeholder="Email Address"
                            />
                            <img src={message} alt="" />
                        </div>
                        <div className="inner-addon mb-3">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                {...register('password', { required: 'Password is required' })}
                                placeholder="Password"
                            />
                            <img src={lock} alt="" />
                        </div>
                        <Link className="forgot-password text-end text-decoration-none text-white" to="#" onClick={handleForgotPassword}>
                            Forgot Password?
                        </Link>
                        <button className="btn btn-lg btn-white btn-block" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Login
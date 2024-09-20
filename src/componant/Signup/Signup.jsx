import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/appLogo.svg'
import lock from '../../assets/images/Lock.svg'
import profile from '../../assets/images/Profile.svg'
import message from '../../assets/images/Message.svg'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './signup.css'
import { toast } from 'sonner'
import { apiInstance } from '../../API/apiBaseURL'

const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch } = useForm();
    const emailValue = watch("email");

    const handleResendOTP = async (data) => {

        try {
            // const type = localStorage.getItem('signupType') || '1';
            const response = await apiInstance.post('auth/resend-otp', {
                email: emailValue,
                type: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success("OTP resent successfully!");

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
                            await handleOTP({ otp, email: data.email });
                            Swal.fire({
                                title: "OTP Verified!",
                                text: "Your account has been verified successfully.",
                                icon: "success"
                            });
                            navigate("/");
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
        } catch (error) {
            console.error('Error resending OTP:', error);
            if (error.response && error.response.status === 409) {
                toast.warning("An OTP has already been sent recently. Please wait before requesting a new one.");
                localStorage.setItem('lastOTPSendTime', Date.now().toString());
            } else if (error.request) {
                toast.error("No response from server. Please check your internet connection.");
            } else {
                toast.error("Error resending OTP. Please try again.");
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`https://demo.iroidsolutions.com:3004/api/v1/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            if (response.status === 200) {
                toast.success("Email Register Successfully!!", response.data.message);
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
                            await handleOTP({ otp, email: data.email });
                            Swal.fire({
                                title: "OTP Verified!",
                                text: "Your account has been verified successfully.",
                                icon: "success"
                            });
                            navigate("/");
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
                toast.error("Error: Invalid response format");
            }
        } catch (error) {
            toast.error("Error: Invalid response format", error);
            console.error(error)
        }
    }

    const handleOTP = async (data) => {
        try {
            const payload = {
                otp: data.otp,
                email: data.email,
                type: 1
            };

            const response = await apiInstance.post(`auth/verify-otp`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (response.status !== 200) {
                throw new Error('OTP verification failed');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <>
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
                            name="firstName"
                            {...register('firstName', { required: 'firstName is required' })}
                            placeholder="First Name"
                        />
                        <img src={profile} alt="" />
                    </div>
                    <div className="inner-addon mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            {...register('lastName', { required: 'lastName is required' })}
                            placeholder="Last Name"
                        />
                        <img src={profile} alt="" />
                    </div>
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
                    <Link className="forgot-password text-end text-decoration-none text-white" to="#" onClick={handleResendOTP}>
                        Resend OTP
                    </Link>
                    <button className="btn btn-lg btn-white btn-block" type="submit">
                        SignUp
                    </button>
                    <Link className="forgot-password text-center text-decoration-none text-white my-3" to="/">
                        Already have an account? Login
                    </Link>
                </form>
            </div>

        </>
    )
}

export default Signup
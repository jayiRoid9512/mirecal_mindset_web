import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/appLogo.svg'
import Hide from '../../assets/images/Hide.svg'
import Show from '../../assets/images/Show.svg'
import lock from '../../assets/images/Lock.svg'
import './changePassword.css'
import { useForm } from 'react-hook-form'
import { apiInstance } from '../../API/apiBaseURL'
import { toast } from 'sonner'

const ChangePassword = () => {
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await apiInstance.post('users/reset-password', {
                ...data,
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response.data.message)
            console.error(error);
        }
    }

    return (
        <>
            <div className="wrapper d-flex align-items-center">
                <form className="form-signin col-md-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="app-logo d-flex justify-content-center">
                        <img src={logo} alt="" />
                    </div>
                    <h1 className="form-signin-heading text-center mt-2">Reset Password</h1>
                    <p className="text-center mb-4 text-white">Create a new password</p>
                    <div className="inner-addon mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            name="newPassword"
                            {...register('newPassword', { required: 'Password is required' })}
                            placeholder="Create New Password"
                        />
                        <img src={lock} alt="" />
                        <div className="eye-icons" onClick={togglePasswordVisibility}>
                            <img src={showPassword ? Hide : Show} alt="" />
                        </div>
                    </div>
                    <div className="inner-addon mb-3">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            name="confirmPassword"
                            {...register('confirmPassword', { required: 'Password is required' })}
                            placeholder="Confirm New Password"
                        />
                        <img src={lock} alt="" />
                        <div className="eye-icons" onClick={toggleConfirmPasswordVisibility}>
                            <img src={showConfirmPassword ? Hide : Show} alt="" />
                        </div>
                    </div>
                    <button className="btn btn-lg btn-white btn-block my-4" type="submit">
                        Save & Login
                    </button>
                </form>
            </div>

        </>
    )
}

export default ChangePassword
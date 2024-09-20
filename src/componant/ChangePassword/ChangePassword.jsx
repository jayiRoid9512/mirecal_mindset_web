import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/appLogo.svg'
import lock from '../../assets/images/Lock.svg'
import './changePassword.css'
import { useForm } from 'react-hook-form'
import { apiInstance } from '../../API/apiBaseURL'
import { toast } from 'sonner'

const ChangePassword = () => {
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm();

    const onSubmit = async(data) => {
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
            if(response.status === 200){
                toast.success(response.data.message)
                navigate('/login')
            }
        } catch (error) {
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
                            type="password"
                            className="form-control"
                            name="newPassword"
                            {...register('newPassword', { required: 'Password is required' })}
                            placeholder="Create New Password"
                        />
                        <img src={lock} alt="" />
                    </div>
                    <div className="inner-addon mb-3">
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            {...register('confirmPassword', { required: 'Password is required' })}
                            placeholder="Confirm New Password"
                        />
                        <img src={lock} alt="" />
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
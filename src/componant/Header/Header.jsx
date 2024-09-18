import React from 'react'
import profile from '../../assets/images/g-wagon.jpg'
import './header.css'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { apiInstance } from '../../API/apiBaseURL'

const Header = () => {
    const handleLogout = async () => {
        try {
            const response = await apiInstance.post('auth/logout', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            if(response.status === 200){    
                localStorage.removeItem('token')
                window.location.href = '/';
                toast.success(response.data.message)
            }
            // return 0;
            
        } catch (error) {
            
        }
    }
    return (
        <div className='header-container d-flex justify-content-between align-items-center'>
            <div className="logout-btn">
                <button type='button' className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
            <div className='d-flex justify-content-end py-3 px-4 align-items-center'>
                <Link to="/change-language" className='header-language text-decoration-none text-white me-2'>Change Language</Link>
                <Link to="#" className="header-profile">
                    <img src={profile} alt="" />
                </Link>
            </div>
        </div>
    )
}

export default Header

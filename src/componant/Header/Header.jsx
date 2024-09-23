import React from 'react'
import profile from '../../assets/images/g-wagon.jpg'
import './header.css'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { apiInstance } from '../../API/apiBaseURL'
import Swal from 'sweetalert2'

const Header = () => {
    const confirmLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't Logout this app",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout()
            }
        })
    }
    const handleLogout = async () => {
        try {
            const response = await apiInstance.post('auth/logout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                localStorage.removeItem('token')
                window.location.href = '/';
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    // const handleProfileUpdate = async () => {
    //     try {
    //         await apiInstance.put('users/edit-profile', {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`
    //             }
    //         }).then((response) => {
    //             if (response.status === 200) {
    //                 toast.success(response.data.message)
    //             }
    //         })
    //     } catch (error) {
    //         toast.error(error.response.data.message)
    //     }
    // }
    const handleProfileClick = () => {
        Swal.fire({
            title: 'Profile Options',
            text: "Choose an option",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Edit Profile',
            cancelButtonText: 'Delete Profile'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Edit Profile',
                    html:
                        '<label htmlFor="firstName">First Name</label>' +
                        '<input id="swal-input1" class="swal2-input" placeholder="First Name">' +
                        '<label htmlFor="lastName">Last Name</label>' +
                        '<input id="swal-input2" class="swal2-input" placeholder="Last Name">',
                    focusConfirm: false,
                    preConfirm: () => {
                        const firstName = document.getElementById('swal-input1').value;
                        const lastName = document.getElementById('swal-input2').value;
                        return { firstName, lastName };
                    }
                }).then((result) => {
                    if (result.value) {
                        const { firstName, lastName } = result.value;
                        apiInstance.put('users/edit-profile', { firstName, lastName }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then((response) => {
                            if (response.status === 200) {
                                toast.success(response.data.message);
                            }
                        }).catch((error) => {
                            toast.error(error.response.data.message);
                        });
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Handle profile deletion logic here
                        console.log('Profile deleted');
                    }
                });
            }
        });
    };
    return (
        <div className='header-container d-flex justify-content-between align-items-center'>
            <div className="logout-btn">
                <button type='button' className='btn btn-danger' onClick={confirmLogout}>Logout</button>
            </div>
            <div className='d-flex justify-content-end py-3 px-4 align-items-center'>
                <Link to="/change-language" className='header-language text-decoration-none text-white me-2'>Change Language</Link>
                {/* <Link to="/your-matras" className="header-profile">
                    <img src={profile} alt="" />
                </Link> */}
                <div className="header-profile" onClick={handleProfileClick}>
                    <img src={profile} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Header

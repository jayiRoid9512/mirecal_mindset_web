import React, { useEffect, useState } from 'react'
import { apiInstance } from '../../API/apiBaseURL'
import Loader from '../Loader/Loader'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import MantraModal from '../MantraModal/MantraModal'
import Swal from 'sweetalert2'

const MatrasFile = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [matras, setMatras] = useState([])
    const [selectedMantra, setSelectedMantra] = useState(null)
    const navigate = useNavigate()

    const fetchMatras = async () => {
        setIsLoading(true)
        try {
            const res = await apiInstance.get('user-mantras/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toast.success(res.data.message)
            setMatras(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMatras()
    }, [])

    const confirmDeleteMantra = (mantraId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't delete this mantra",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteMantra(mantraId)
            }
        })
    }

    const handleDeleteMantra = async (mantraId) => {
        try {
            await apiInstance.delete(`user-mantras/delete?mantraId=${mantraId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                toast.success(res.data.message)
                fetchMatras()
            })
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    const handleAddMantra = () => {
        navigate('/home')
    }

    const handleMantraClick = (mantra) => {
        setSelectedMantra(mantra)
    }

    return (
        <div className='text-white'>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Your Mantras</h1>
                <button className='btn btn-primary' onClick={handleAddMantra}>Add Mantra</button>
            </div>
            {isLoading ? <Loader /> : (
                matras.map((mantra) => (
                    <div key={mantra._id} className='recording-item d-flex align-items-center justify-content-between p-3 rounded-3 mb-3' onClick={() => handleMantraClick(mantra)}>
                        <div className="d-flex">
                            <img src={mantra.mantraImage} style={{ width: "50px", height: "50px", borderRadius: "10px" }} alt="" />
                            <div className='ms-3'>
                                <p className='mb-0'>{mantra.mantraName}</p>
                                <p className='mb-0'>{mantra.aiVoiceFileDuration}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            {/* <audio src={mantra.aiVoiceFile} controls></audio> */}
                            {/* <button className='btn btn-danger delete-btn' onClick={() => handleDeleteMantra(mantra._id)}>Delete</button> */}
                            <button className='btn btn-danger delete-btn' onClick={(e) => { e.stopPropagation(); confirmDeleteMantra(mantra._id); }}>Delete</button>
                        </div>
                    </div>
                ))
            )}

            <MantraModal mantra={selectedMantra} onClose={() => setSelectedMantra(null)} />
        </div>
    )
}

export default MatrasFile

import React, { useEffect, useState } from 'react'
import { apiInstance } from '../../API/apiBaseURL'
import Loader from '../Loader/Loader'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MatrasFile = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [matras, setMatras] = useState([])
    const navigate = useNavigate()

    const fetchMatras = async () => {
        setIsLoading(true)
        try {
            await apiInstance.get('user-mantras/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                console.log(response.data.data)
                toast.success(response.data.message)
                setMatras(response.data.data)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMatras()
    }, [])

    const handleAddMantra = () => {
        navigate('/home')
    }

    return (
        <div className='text-white'>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Your Mantras</h1>
                <button className='btn btn-primary' onClick={handleAddMantra}>Add Mantra</button>
            </div>
            {isLoading ? <Loader /> : (
                matras.map((matra) => (
                    <div key={matra._id} className='recording-item d-flex align-items-center justify-content-between p-3 rounded-3 mb-3'>
                        <div className="d-flex">
                            <img src={matra.mantraImage} style={{ width: "50px", height: "50px", borderRadius: "10px" }} alt="" />
                            <div className='ms-3'>
                                <p className='mb-0'>{matra.mantraName}</p>
                                <p className='mb-0'>{matra.aiVoiceFileDuration}</p>
                                {/* <p className='mb-0'>{matra.categoryName}</p> */}
                            </div>
                        </div>
                        <div className="d-flex">
                            <audio src={matra.aiVoiceFile} controls></audio>
                            {/* <p>{matra.voiceText}</p> */}
                        </div>
                    </div>
                ))
            )}


        </div>
    )
}

export default MatrasFile

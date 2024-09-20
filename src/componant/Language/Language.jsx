import React, { useState } from 'react'
import './language.css'
import English from '../../assets/images/English.svg'
import French from '../../assets/images/French.svg'
import { apiInstance } from '../../API/apiBaseURL'
import { toast } from 'sonner'

const Language = () => {
    const [language, setLanguage] = useState(1);

    const onLanguageChange = async (selectedLanguage) => {
        setLanguage(selectedLanguage);

        try {
            await apiInstance.post(`users/language`, {
                language: selectedLanguage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }).then((res) => {
                if (res.data && res.data.language) {
                    setLanguage(res.data.language);
                    toast.success(res.data.message);
                }
            })
        } catch (error) {
            console.error("Error changing language:", error);
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
            <div className="col-4">
                <div className='text-white p-4 text-center'>
                    <h3>Change Language</h3>
                </div>

                <div className="col-12">
                    <div
                        className={`language d-flex align-items-center p-4 w-100 ${language === 1 ? 'active' : ''}`}
                        onClick={() => onLanguageChange(1)}
                    >
                        <img src={English} alt="" />
                        <h3 className='text-white m-0 ms-2'>English</h3>
                    </div>
                    <div
                        className={`language d-flex align-items-center p-4 w-100 ${language === 2 ? 'active' : ''}`}
                        onClick={() => onLanguageChange(2)}
                    >
                        <img src={French} alt="" />
                        <h3 className='text-white m-0 ms-2'>French</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Language

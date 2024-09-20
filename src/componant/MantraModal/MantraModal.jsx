import React, { useState, useEffect } from 'react';
import './mantraModal.css';

const MantraModal = ({ mantra, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (mantra) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [mantra]);

    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="mantraModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5" id="mantraModalLabel">Mantra Details</h1>
                            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {mantra ? (
                                <div>
                                    <div className='text-center mb-3'>
                                        <img src={mantra.mantraImage} alt={mantra.mantraName} style={{ width: "300px", height: "300px", borderRadius: "20px", objectFit: "cover" }} />
                                        <h2>{mantra.mantraName}</h2>
                                        <p>{mantra.categoryName}</p>
                                        <audio src={mantra.aiVoiceFile} controls></audio>
                                    </div>
                                    <p>{mantra.voiceText}</p>
                                    {/* Add more details as needed */}
                                </div>
                            ) : (
                                <p>No mantra selected</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default MantraModal;
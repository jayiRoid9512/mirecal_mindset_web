import React, { useState, useRef, useEffect } from 'react';
import { apiInstance } from '../../../API/apiBaseURL';
// import './RecordingStep.css';

const Step3 = ({ onNext, onPrev, onSelectRecording, onAudioChange }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [preference, setPreference] = useState();

    const [Recording, setRecording] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState([]);

    // const [audioFile, setAudioFile] = useState(null);

    const [recordedAudioURL, setRecordedAudioURL] = useState('');
    const [uploadedAudioURL, setUploadedAudioURL] = useState('');

    const [isVoiceSelected, setIsVoiceSelected] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // setAudioFile(file);
            const audioUrl = URL.createObjectURL(file);
            setUploadedAudioURL(audioUrl);
            setRecordedAudioURL('');
            onAudioChange(file, 'uploaded'); // Pass the file and type to parent
            setIsVoiceSelected(true);
        }
    };

    const fetchRecording = async () => {
        try {
            await apiInstance.get('user-step/voice', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }).then((res) => {
                setRecording(res.data.data);
            })
        } catch (error) {
            console.error('Error fetching recordings:', error);
        }
    }

    // useEffect(() => {
    //     fetchRecording();
    // }, [])

    const handlePreferenceChange = (e) => {
        const newPreference = e.target.value;
        setPreference(newPreference);
        if (newPreference === 'other') {
            fetchRecording();
        }
    };

    const handleRecordingSelect = (id) => {
        setSelectedRecording(id === selectedRecording ? null : id);
        onSelectRecording(id);
        setIsVoiceSelected(!!id);
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudioURL(audioUrl);
                setUploadedAudioURL('');
                onAudioChange(audioBlob, 'recorded'); // Pass the blob and type to parent
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsVoiceSelected(false); // Reset when starting a new recording
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsVoiceSelected(true);
        }
    };

    return (
        <div className="recording-step">
            <div className="text-white">
                <h2>Step 3</h2>
                <p>Choose your preference</p>
            </div>

            <div className="d-flex text-white mb-4 preference-select-wrapper">
                <div className="form-check me-4">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="preference"
                        value="yourself"
                        checked={preference === 'yourself'}
                        onChange={(e) => setPreference(e.target.value)}
                    />
                    <label className="form-check-label">Yourself</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="preference"
                        value="other"
                        checked={preference === 'other'}
                        onChange={handlePreferenceChange}
                    />
                    <label className="form-check-label">Other Person</label>
                </div>
            </div>
            {preference === 'yourself' && (
                <div className="recording-controls-wrapper">
                    <div className="d-flex">
                        <div className="recording-controls me-3">
                            {!isRecording ? (
                                <button onClick={startRecording} className='recording-btn'>Start Recording</button>
                            ) : (
                                <button onClick={stopRecording} className='recording-btn'>Stop Recording</button>
                            )}
                        </div>
                        <div className="upload-controls">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                id="audio-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="audio-upload" className="upload-btn">
                                Upload Audio
                            </label>
                        </div>
                    </div>
                    {uploadedAudioURL && (
                        <div className="audio-playback mt-4">
                            <p className='text-white'>Uploaded Audio:</p>
                            <audio src={uploadedAudioURL} controls />
                        </div>
                    )}
                    {recordedAudioURL && (
                        <div className="audio-playback mt-4">
                            <p className='text-white'>Recorded Audio:</p>
                            <audio src={recordedAudioURL} controls />
                        </div>
                    )}
                </div>
            )}

            {preference === 'other' && (
                <div className="recording-select-wrapper">
                    {Recording.map((item) =>
                        <div className={`recording-item align-items-center justify-content-between ${selectedRecording === item.voice_id ? 'selected' : ''}`} key={item._id} onClick={() => handleRecordingSelect(item.voice_id)}>
                            <div className="recording-item-left d-flex align-items-center">
                                <img src={item.image} style={{ width: "50px", height: "50px", borderRadius: "10px" }} alt={item.name} b />
                                <p className='text-white text-center mb-0 ms-3'>{item.name}</p>
                            </div>
                            <audio src={item.preview_url} controls />
                        </div>
                    )}
                </div>
            )}

            <div className="navigation-buttons mt-5">
                <button onClick={onPrev} className='previous-btn me-4'>Previous</button>
                <button 
                    onClick={onNext} 
                    className='next-btn'
                    disabled={!isVoiceSelected}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step3;
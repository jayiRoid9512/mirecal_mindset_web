import React, { useState } from 'react'
import Header from '../Header/Header'
import Step1 from './Step1/Step1'
import Step2 from './Step2/Step2'
import Step3 from './Step3/Step3'
import Step4 from './Step4/Step4'
import Step5 from './Step5/Step5'
import Step6 from './Step6/Step6'
import './homepage.css'
import { apiInstance } from '../../API/apiBaseURL'
import { toast } from 'sonner'
import Loader from '../Loader/Loader'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [recordingId, setRecordingId] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [audioType, setAudioType] = useState(null);
  const [backgroundMusicId, setBackgroundMusicId] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [mantraTitle, setMantraTitle] = useState('');
  const [step1Data, setStep1Data] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const nextStep = (data) => {
    if (currentStep === 1 && data) {
      setStep1Data(data);
    }
    setCurrentStep(prevStep => prevStep + 1);
  }

  const prevStep = () => {
    setCurrentStep(prevStep => prevStep - 1)
  }

  const handleAudioChange = (audio, type) => {
    setAudioData(audio);
    setAudioType(type);
  };

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

  const handleComplete = (time) => {
    setReminderTime(time);
  };

  const handleMantraTitleChange = (title) => {
    setMantraTitle(title);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={nextStep} />
      case 2:
        return <Step2 onNext={nextStep} onPrev={prevStep} onCategorySelect={(categoryId) => setSelectedCategoryId(categoryId)} />
      case 3:
        return <Step3 onNext={nextStep} onPrev={prevStep} onSelectRecording={(id) => setRecordingId(id)} onAudioChange={handleAudioChange} />
      case 4:
        return <Step4 onNext={nextStep} onPrev={prevStep} onBackgroundMusicSelect={(id) => setBackgroundMusicId(id)} />
      case 5:
        return <Step5
          onNext={nextStep}
          onPrev={prevStep}
          uploadedImage={uploadedImage}
          onImageUpload={handleImageUpload}
          onMantraTitleChange={handleMantraTitleChange}
        />
      case 6:
        return <Step6 onPrev={prevStep} onComplete={handleComplete} handlePostData={handlePostData} />
      default:
        return <Step1 onNext={nextStep} />
    }
  }

  const handlePostData = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append('mantraName', mantraTitle);
      formData.append('step1Id', step1Data);
      formData.append('categoryId', selectedCategoryId);
      formData.append('YourselfVoiceStatus', "false");
      formData.append('preferenceVoiceId', recordingId);
      formData.append('backgroundVoiceId', backgroundMusicId);
      formData.append('notificationTimestamp', reminderTime || "9:41 AM");

      if (uploadedImage instanceof File) {
        formData.append('mantraImage', uploadedImage);
      } else if (typeof uploadedImage === 'string') {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        formData.append('mantraImage', blob, 'image.jpg');
      }

      await apiInstance.post('user-step/notification-reminder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then((res) => {
        toast.success(res.data.message);
        navigate('/your-matras')
      })
    } catch (error) {
      console.error("Error during API request:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? <Loader /> : renderStep()}
    </div>
  )
}

export default HomePage

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
    // You can add any additional logic here, such as submitting the data to a server
    console.log("All steps completed. Reminder time:", time);
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
        return <Step6 onPrev={prevStep} onComplete={handleComplete} />
      default:
        return <Step1 onNext={nextStep} />
    }
  }

  // const handlePostData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = {
  //       mantraName: mantraTitle,
  //       step1Id: step1Data,
  //       categoryId: selectedCategoryId,
  //       YourselfVoiceStatus: "false",
  //       // voiceFile: audioData,
  //       preferenceVoiceId: recordingId,
  //       backgroundVoiceId: backgroundMusicId,
  //       mantraImage: uploadedImage,
  //       notificationTimestamp: reminderTime || "9:41 AM"
  //     }
  //     await apiInstance.post('user-step/notification-reminder', data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     }).then((res) => {
  //       console.log(res.data);
  //       toast.success(res.data.message);
  //     })
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.response.data.message || "An error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handlePostData = async () => {
    setIsLoading(true);
    try {
      const data = {
        mantraName: mantraTitle,
        step1Id: step1Data,
        categoryId: selectedCategoryId,
        YourselfVoiceStatus: "false",
        preferenceVoiceId: recordingId,
        backgroundVoiceId: backgroundMusicId,
        mantraImage: uploadedImage,  // Base64 encoded image
        notificationTimestamp: reminderTime || "9:41 AM"
      };

      console.log("Payload being sent:", data);

      const response = await apiInstance.post('user-step/notification-reminder', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response && response.data) {
        console.log(response.data);
        toast.success(response.data.message);
      } else {
        throw new Error("Unexpected response structure");
      }

    } catch (error) {
      console.error("Error during API request:", error);

      if (error.response) {
        console.error("Server response data:", error.response.data);  // Log full error response data
        const errorMessage = error.response.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      {isLoading ? <Loader /> : renderStep()}
      {mantraTitle && <p className='text-white font-bold mt-4'>Mantra Title: {mantraTitle}</p>}
      {step1Data && <p className='text-white font-bold'>step1Id set for: {step1Data}</p>}
      {selectedCategoryId && <p className='text-white font-bold'>categoryId set for: {selectedCategoryId}</p>}
      {recordingId && <p className='text-white font-bold'>preferenceVoiceId set for: {recordingId}</p>}
      {backgroundMusicId && <p className='text-white font-bold'>backgroundVoiceId set for: {backgroundMusicId}</p>}
      {uploadedImage && <p className='text-white font-bold'>imgURL set for: {uploadedImage}</p>}
      {uploadedImage && <p className='text-white font-bold'>mantraImage set for: <img src={uploadedImage} height={50} width={50} alt="" /></p>}
      {reminderTime && <p className='text-white font-bold'>notificationTimestamp set for: {reminderTime}</p>}
      {currentStep === 6 && (
        <button onClick={handlePostData} className="submit-btn">Submit All Data</button>
      )}
    </div>
  )
}

export default HomePage

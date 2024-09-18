import React, { useEffect, useState } from 'react'
import { apiInstance } from '../../../API/apiBaseURL';
import { toast } from 'sonner';

const Step4 = ({ onNext, onPrev, onBackgroundMusicSelect }) => {
  const [selectedBackgroundMusic, setSelectedBackgroundMusic] = useState([]);
  const [selectedBackgroundMusicId, setSelectedBackgroundMusicId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBackgroundMusic = async () => {
    setIsLoading(true);
    try {
      const response = await apiInstance.get(`user-step/background-voice?perPage=10&page=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success(response.data.message);
      console.log(response.data);
      // Ensure we're setting an array
      setSelectedBackgroundMusic(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching background music:', error);
      toast.error('Failed to fetch background music');
      setSelectedBackgroundMusic([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBackgroundMusic();
  }, []);

  const handleRecordingSelect = (id) => {
    console.log(id);
    setSelectedBackgroundMusicId(id === selectedBackgroundMusicId ? null : id);
    onBackgroundMusicSelect(id);
  }

  const handleNext = () => {
    if (selectedBackgroundMusicId) {
      onNext();
    } else {
      toast.error('Please select a category before proceeding.');
    }
  };

  return (
    <div className='step-container text-white'>
      <div className="text-white">
        <h2>Step 4</h2>
        <p>Select music</p>
      </div>
      {isLoading ? (
        <p>Loading background music...</p>
      ) : selectedBackgroundMusic.length > 0 ? (
        selectedBackgroundMusic.map((item) => (
          <div className={`recording-item d-flex align-items-center justify-content-between p-3 rounded-3 mb-3 ${selectedBackgroundMusicId === item._id ? 'selected' : ''}`} key={item._id} onClick={() => handleRecordingSelect(item._id)}>
            <div className="d-flex align-items-center">
              <img src={item.imageURL} alt={item.image} style={{ width: "50px", height: "50px", borderRadius: "10px" }} />
              <div className="text-white ms-3">
                <p className='mb-0'>{item.voice}</p>
                <p className='mb-0'>{item.audioDuration}</p>
              </div>
            </div>
            <audio src={item.voiceURL} controls></audio>
          </div>
        ))
      ) : (
        <p>No background music available</p>
      )}
      <div className="mt-5">
        <button onClick={onPrev} className='previous-btn me-4'>Previous</button>
        <button onClick={handleNext} className='next-btn'>Next</button>
      </div>
    </div>
  )
}

export default Step4

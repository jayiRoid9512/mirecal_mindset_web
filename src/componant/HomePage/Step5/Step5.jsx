import React, { useState, useEffect } from 'react'

const Step5 = ({ onNext, onPrev, uploadedImage, onImageUpload, onMantraTitleChange }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [mantraTitle, setMantraTitle] = useState('');

  useEffect(() => {
    if (uploadedImage) {
      setImageSrc(uploadedImage);
    }
  }, [uploadedImage]);

  const fileUpload = (event) => {
    const files = event.target.files;
    console.log(files)
    if (files.length > 0) {
      const newImageSrc = URL.createObjectURL(files[0]);
      setImageSrc(newImageSrc);
      onImageUpload(newImageSrc);
    }
  };

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setMantraTitle(newTitle);
    onMantraTitleChange(newTitle);
  };

  console.log(imageSrc)

  return (
    <div className='step-container text-white'>
      <div className="text-white">
        <h2>Step 5</h2>
        <p>Add photo and title</p>
      </div>

      <div className="tb-container">
        <div className="tb-img-view">
          {imageSrc && <img src={imageSrc} alt="" />}
        </div>
        <label htmlFor="tb-file-upload" className='my-3 img-upload-btn'>Upload Image</label>
        <input type="file" id="tb-file-upload" accept="image/*" onChange={fileUpload} hidden />
      </div>
      <div className="mantra-title">
        <input 
          type="text" 
          placeholder='Mantra Title' 
          className='mantra-title-input' 
          value={mantraTitle}
          onChange={handleTitleChange}
        />
      </div>

      <div className="mt-5">
        <button onClick={onPrev} className='previous-btn me-4'>Back</button>
        <button onClick={onNext} className='next-btn'>Next</button>
      </div>
    </div>
  )
}

export default Step5

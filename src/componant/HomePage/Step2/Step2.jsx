import React, { useEffect, useState } from 'react';
import { apiInstance } from '../../../API/apiBaseURL';
import { toast } from 'sonner';

const Step2 = ({ onNext, onPrev, onCategorySelect }) => {

  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      await apiInstance.get(`user-step/category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then((res) => {
        setCategory(res.data.data);
        toast.success(res.data.message);
      })
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    onCategorySelect(categoryId);
  };

  const handleNext = () => {
    if (selectedCategory) {
      onNext();
    } else {
      toast.error('Please select a category before proceeding.');
    }
  };

  return (
    <form >
      <div className="text-white">
        <h2>Step 2</h2>
        <p>Choose your preference.</p>
      </div>

      <div className="d-flex flex-wrap">
        {category.map((item) => (
          <div
            key={item._id}
            className={`me-2 p-4 box-wrapper ${selectedCategory === item._id ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(item._id)}
          >
            <img src={item.image} style={{ width: "100px", height: "100px" }} alt={item.name} />
            <p className='text-white text-center mt-3 mb-0'>{item.name}</p>
          </div>
        ))}
      </div>

      <div className="navigation-buttons my-5">
        <button onClick={onPrev} className='previous-btn me-4'>Previous</button>
        <button onClick={handleNext} className='next-btn'>Next</button>
      </div>
    </form>
  );
};

export default Step2;
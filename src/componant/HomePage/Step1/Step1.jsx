import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiInstance } from '../../../API/apiBaseURL';
import { toast } from 'sonner';

const Step1 = ({ onNext }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                data: Object.entries(data).map(([key, value], index) => ({
                    question_id: index + 1,
                    text: value.trim()
                }))
            };

            const response = await apiInstance.post('user-step/step-1', formattedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                onNext(response.data.data._id);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "An error occurred. Please try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className='step1-container text-white' onSubmit={handleSubmit(onSubmit)}>
            <div className="text-white">
                <h2>Step 1</h2>
                <p>Give the questions answers.</p>
            </div>

            {[
                "What is a big and audacious goal you are about?",
                "Why you need to get it?",
                "How will you do it (Macro way)",
                "What will you feel when you'll achieved it?",
                "Who do you need to become to achieve that?",
                "What are you grateful for? (Specific things)"
            ].map((question, index) => (
                <div key={index} className="question-wrapper mb-4">
                    <p>{index + 1}. {question}</p>
                    <textarea 
                        {...register(`question${index + 1}`, { 
                            required: "This field is required",
                            minLength: { value: 10, message: "Answer must be at least 10 characters long" },
                            maxLength: { value: 500, message: "Answer must not exceed 500 characters" }
                        })}
                    ></textarea>
                    {errors[`question${index + 1}`] && <span className="error">{errors[`question${index + 1}`].message}</span>}
                </div>
            ))}

            <div className="my-5">
                <button type='submit' className='next-btn' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
            </div>
        </form>
    )
}

export default Step1
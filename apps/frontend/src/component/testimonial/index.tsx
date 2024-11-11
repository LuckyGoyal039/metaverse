import React from 'react';

interface TestimonialCardProps {
  profileImage: string;
  name: string;
  title: string;
  officeImage: string;
  testimonial: string;
  linkText: string;
  linkUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  profileImage,
  name,
  title,
  officeImage,
  testimonial,
  linkText,
  linkUrl
}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img className="w-12 h-12 rounded-full" src={profileImage} alt={`${name}'s profile`} />
        <div>
          <h5 className="text-lg font-semibold text-gray-900">{name}</h5>
          <span className="text-sm text-gray-500">{title}</span>
        </div>
      </div>
      
      <div className="mt-4 mx-[-25px]">
        <img src={officeImage} alt="Office" />
      </div>

      <p className="mt-4 text-sm text-gray-700 italic">“{testimonial}”</p>
      
      <a
        href={linkUrl}
        className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium"
      >
        {linkText}
      </a>
    </div>
  );
};

export default TestimonialCard;
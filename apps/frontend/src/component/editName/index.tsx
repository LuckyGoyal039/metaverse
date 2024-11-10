import React, { useState } from 'react';

interface CardProps {
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

const EditName: React.FC<CardProps> = ({ imageUrl, title, description, link }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(title);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // const handleSave = () => {
  //   setIsEditing(false);
  // };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href={link}>
        <img className="rounded-t-lg" src={imageUrl} alt="Card image" />
      </a>
      <div className="p-5">
        <a href={link}>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
          )}
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
        <div>
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isEditing ? 'Save' : 'Edit'}
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditName;

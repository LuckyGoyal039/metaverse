import React, { useState, useEffect } from 'react';
import avatar60 from '../../assets/avatar_60_dancing.png';

const WaitingPage: React.FC = () => {
  const [dots, setDots] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div className="relative">
        <img
          src={avatar60}
          alt="Nothing Found"
          className="w-12 h-15 animate-bounce"
        />
      </div>
      <h1 className=" w-32 mt-2 text-xl font-semibold text-white">
        Please wait {dots}
      </h1>
    </div>
  );
};

export default WaitingPage;

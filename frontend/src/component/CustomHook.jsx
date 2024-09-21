// src/components/CountdownTimer.jsx

import React, { useState, useEffect } from "react";

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex justify-center space-x-2">
      <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
        <span className="block text-lg font-bold">{timeLeft.days}</span>
        <span className="text-sm">Ngày</span>
      </div>
      <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
        <span className="block text-lg font-bold">{timeLeft.hours}</span>
        <span className="text-sm">Giờ</span>
      </div>
      <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
        <span className="block text-lg font-bold">{timeLeft.minutes}</span>
        <span className="text-sm">Phút</span>
      </div>
      <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
        <span className="block text-lg font-bold">{timeLeft.seconds}</span>
        <span className="text-sm">Giây</span>
      </div>
    </div>
  );
};

export default CountdownTimer;

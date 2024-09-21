import React, { useState, useEffect } from "react";

const CountdownTimer = ({ startDate, endDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const distance = end - now;
    const distanceToStart = start - now;

    if (distanceToStart > 0) {
      return {
        days: Math.floor(distanceToStart / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distanceToStart % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distanceToStart % (1000 * 60)) / 1000),
        status: "upcoming",
      };
    } else if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        status: "ongoing",
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: "ended",
      };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  return (
    <div className="text-center p-4  rounded-lg ">
      {timeLeft.status === "upcoming" && (
        <div className="text-white font-bold">
          Sự kiện bắt đầu trong:
          <div className="flex justify-center space-x-2">
            <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
              <span className="block text-lg font-bold">{timeLeft.days}</span>
              {/* <span className="text-sm">Ngày</span> */}
            </div>
            <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
              <span className="block text-lg font-bold">{timeLeft.hours}</span>
              {/* <span className="text-sm">Giờ</span> */}
            </div>
            <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
              <span className="block text-lg font-bold">
                {timeLeft.minutes}
              </span>
              {/* <span className="text-sm">Phút</span> */}
            </div>
            <div className="bg-[#001373] border border-black p-2 rounded-lg text-[#0ac5a0] text-center">
              <span className="block text-lg font-bold">
                {timeLeft.seconds}
              </span>
              {/* <span className="text-sm">Giây</span> */}
            </div>
          </div>
        </div>
      )}
      {timeLeft.status === "ongoing" && (
        <div className="text-[#FFF0BF] font-bold">
          Sự kiện kết thúc trong:
          <div className="flex justify-center space-x-2">
            <div className="w-8 h-8 bg-[#FFF0BF] border  rounded-full text-[#222222]  text-center">
              <span className="block  text-lg font-bold ">{timeLeft.days}</span>
              {/* <span className="text-sm">Ngày</span> */}
            </div>
            <div>:</div>
            <div className="w-8 h-8 bg-[#FFF0BF] border  rounded-full text-[#222222]  text-center">
              <span className="block  text-lg font-bold">{timeLeft.hours}</span>
              {/* <span className="text-sm">Giờ</span> */}
            </div>
            <div>:</div>

            <div className="w-8 h-8 bg-[#FFF0BF] border  rounded-full text-[#222222]  text-center">
              <span className="block text-lg font-bold">
                {timeLeft.minutes}
              </span>
              {/* <span className="text-sm">Phút</span> */}
            </div>
            <div>:</div>

            <div className="w-8 h-8 bg-[#FFF0BF] border  rounded-full text-[#222222]  text-center">
              <span className="block text-lg font-bold">
                {timeLeft.seconds}
              </span>
              {/* <span className="text-sm">Giây</span> */}
            </div>
          </div>
        </div>
      )}
      {/* {timeLeft.status === "ended" && (
        <div className="text-red-500 font-bold">Sự kiện đã kết thúc</div>
      )} */}
    </div>
  );
};

export default CountdownTimer;

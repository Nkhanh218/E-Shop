import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
const ProductCarousel = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get("/api/banners");
        const visibleBanners = data.filter((banner) => banner.visible);
        setBanners(visibleBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,

    responsive: [
      {
        breakpoint: 768, // Điều chỉnh cho màn hình nhỏ hơn
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mx-auto relative">
      {banners.map((banner) => (
        <div key={banner._id}>
          {/* Main Banner */}
          <div className="relative">
            <img
              src={banner.mainBanner.url}
              alt="Main Banner"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute bottom-[-120px] left-1/2 transform -translate-x-1/2 w-full px-40 z-1">
              <Slider {...slickSettings}>
                {banner.smallSlider.map((slider, index) => (
                  <div key={index} className="p-2 around-lg">
                    <img
                      src={slider.url}
                      alt={`Small Slider ${index + 1}`}
                      className="mb-2 w-full h-[180px] object-cover rounded-xl"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="pt-[120px] px-40 bg-[#EDF2F9] flex items-center justify-center">
            <img
              src={banner.smallBanner.url}
              alt="Small Banner"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;

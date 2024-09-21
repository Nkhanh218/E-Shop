import React from "react";
import { useGetAllEventsQuery } from "../../redux/api/eventApiSlice";
import { Spin } from "antd";
import ProductCard from "./ProductCard";
import CountdownTimer from "../../component/customhook/CountdownTimer";
import Slider from "react-slick";
const EventList = () => {
  const { data: events, isLoading, error } = useGetAllEventsQuery();

  if (isLoading) return <Spin size="large" />;
  if (error)
    return (
      <div>
        Đã xảy ra lỗi khi tải danh sách sự kiện:{" "}
        {error.message || "Lỗi không xác định"}
      </div>
    );
  if (!events || events.length === 0) return <div>Không có sự kiện nào</div>;
  const CustomNextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} custom-next-arrow`}
        style={{
          top: "420px",
        }}
        onClick={onClick}
      ></div>
    );
  };

  const CustomPrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} custom-prev-arrow`}
        style={{
          top: "420px",
        }}
        onClick={onClick}
      ></div>
    );
  };
  const settings = {
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    centerMode: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="px-40 bg-[#EDF2F9]">
      {events.map((event) => (
        <div
          key={event.id}
          style={{ backgroundColor: event.color }}
          className="w-full rounded-2xl  "
        >
          {event.images?.url && (
            <img
              src={event.images.url}
              alt="Event"
              className="w-full rounded-lg"
            />
          )}
          <CountdownTimer
            startDate={new Date(event.startDate).getTime()}
            endDate={new Date(event.endDate).getTime()}
          />
          {event.products?.length > 10 ? (
            <Slider {...settings}>
              {event.products.map((product) => (
                <div className="pn-4 " key={product.product}>
                  <ProductCard
                    productId={product.product}
                    fastList={true}
                    saleList={true}
                    soldQuantity={product?.soldQuantity}
                    maxTotalQuantity={product?.maxTotalQuantity}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 pb-4">
              {event.products.map((product) => (
                <div key={product.product}>
                  <ProductCard
                    productId={product.product}
                    fastList={true}
                    saleList={true}
                    soldQuantity={product?.soldQuantity}
                    maxTotalQuantity={product?.maxTotalQuantity}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;

import React from "react";
import Navigation from "./Auth/Navigation";
import { useParams } from "react-router";
import Header from "./../component/Header";
import EventList from "./Products/EventList";
import ProductCategory from "./Products/ProductCategory";

const Home = () => {
  const { keyword } = useParams();
  return (
    <div className="bg-[#EDF2F9] h-screen ">
      <div className="pt-20">
        <Navigation />
        {!keyword ? <Header /> : null}
        <EventList />
        <ProductCategory />
      </div>
    </div>
  );
};

export default Home;

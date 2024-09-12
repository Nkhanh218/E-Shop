import React from "react";
import Navigation from "./Auth/Navigation";
import { useParams } from "react-router";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Header from "./../component/Header";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({});
  return (
    <div className="bg-[#EDF2F9] h-screen ">
      <div className="pt-36">
        <Navigation />
        {!keyword ? <Header /> : null}
      </div>
    </div>
  );
};

export default Home;

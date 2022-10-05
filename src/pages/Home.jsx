import React from "react";
import homeImage from "../assets/ticket-home.svg";

const Home = () => {

  return (
    <div className="text-center m-3 p-3">
      <img src={homeImage} alt="home" className="w-50" />
    </div>
  );
};

export default Home;

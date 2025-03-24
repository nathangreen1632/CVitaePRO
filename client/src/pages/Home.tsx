import React from "react";
import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";

const Home = (): React.JSX.Element => {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <Spline
        scene="https://prod.spline.design/ebUc8RxpXDIysAET/scene.splinecode"
        className="absolute inset-0 w-full h-full"
      />

      <div className="absolute top-[30%] text-center px-4">
        <h1 className="text-white text-4xl sm:text-5xl font-bold mb-4">
          Build Your Perfect Resume
        </h1>
      </div>

      <div className="absolute bottom-[25%] text-center px-4">
        <p className="text-gray-300 text-base sm:text-lg mb-6">
          AI-powered resume creation to land your dream job.
        </p>
        <Link to="/register">
          <button className="bg-red-500 text-white text-lg font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-red-700 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

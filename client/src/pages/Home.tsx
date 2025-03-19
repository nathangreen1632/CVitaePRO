import React from "react";
import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";

const Home = (): React.JSX.Element => {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
      <Spline
        scene="https://prod.spline.design/ebUc8RxpXDIysAET/scene.splinecode"
        onLoad={() => console.log("Spline loaded successfully")}
        onError={(error) => console.error("Spline failed to load:", error)}
        className="absolute inset-0 w-full h-full"
      />

      <div className="absolute top-1/3 text-center">
        <h1 className="text-white text-5xl font-bold mb-6">
          Build Your Perfect Resume
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          AI-powered resume creation to land your dream job.
        </p>

        <Link to="/register">
          <button className="bg-red-500 text-white text-lg font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-red-600 transition mt-30">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

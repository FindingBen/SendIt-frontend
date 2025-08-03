import React from "react";

const DemoPage = () => {
  return (
    <section class="flex flex-col justify-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 h-screen p-4 w-100">
      <div class="flex flex-col items-center">
        <img
          src={require("../assets/noBgLogo.png")}
          width={100}
          className="mt-2"
        />
        <div class="max-w-[440px] mx-auto flex flex-col mb-10 text-3xl">
          The app is currently restricted, please send your request below in
          order to get access!
        </div>
        <p className="text-xl text-white hover:text-white/20 cursor-pointer">
          support@sendperplane.com
        </p>
      </div>
    </section>
  );
};

export default DemoPage;

import React from "react";

const Custom404 = () => {
  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
          }}
        >
          <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center border-round-xl">
            <span className="text-blue-500 font-bold text-3xl">404</span>
            <h1 className="text-900 font-bold text-5xl mb-2">Not Found</h1>
            <div className="text-600 mb-5">
              Requested resource is not available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Custom404.getLayout = function getLayout(page) {
  return <React.Fragment>{page}</React.Fragment>;
};

export default Custom404;

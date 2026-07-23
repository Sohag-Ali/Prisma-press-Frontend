
import React from "react";

const AuthLayout = (
    { children }: { children: React.ReactNode }
) => {
  return <div className="max-with-7xl mx-auto ">

    {children}
  </div>
};

export default AuthLayout;

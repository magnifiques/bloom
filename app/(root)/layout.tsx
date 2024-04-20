import React from "react";

type RootLayoutType = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutType) => {
  return <main>{children}</main>;
};

export default RootLayout;

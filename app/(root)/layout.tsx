import StreamVideoProvider from "@/providers/StreamClientProvider";
import React from "react";

type RootLayoutType = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutType) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;

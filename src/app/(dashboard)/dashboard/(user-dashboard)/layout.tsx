import AuthWrapper from "@/src/components/pages/dashboardLayout/AuthWrapper";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthWrapper role="USER">{children}</AuthWrapper>
    </>
  );
};

export default Layout;

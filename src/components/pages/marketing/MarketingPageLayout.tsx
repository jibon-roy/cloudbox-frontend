import { ReactNode } from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const MarketingPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <MarketingNavbar />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
};

export default MarketingPageLayout;

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Sidebar for both desktop and mobile */}
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main content area */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300
        ${isExpanded ? "lg:ml-64" : "lg:ml-20"} ml-0`}
      >
        <Navbar setIsMobileOpen={setIsMobileOpen} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </>
  );
};

export default Layout;

import React from "react";
import SidebarWithHeader from "./navbar";

const MainTemplate = ({children}) => {
  return (
    <SidebarWithHeader>
        {children}
    </SidebarWithHeader>
  );
};

export default MainTemplate;

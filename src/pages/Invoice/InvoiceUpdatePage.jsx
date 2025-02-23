import React, { useContext, useState } from "react";
import { DashboardContext } from "../Dashboard";
import { GiHamburgerMenu } from "react-icons/gi";
import InvoiceUpdate from "../../components/invoice/InvoiceUpdate";

const InvoiceUpdatePage = () => {


  const { handleToggleClick } = useContext(DashboardContext);
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="toggle" onClick={handleToggleClick}>
        <GiHamburgerMenu />
      </div>

      <div>
      

        <InvoiceUpdate />
      </div>
    </div>
  );
};

export default InvoiceUpdatePage;

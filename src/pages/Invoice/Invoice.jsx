import React, { useEffect, useState, useContext } from "react";
import InvoiceForm from "../../components/invoice/InvoiceForm";
import { DashboardContext } from "../Dashboard";
import { GiHamburgerMenu } from "react-icons/gi";

const InvoicePage = () => {
  const { handleToggleClick } = useContext(DashboardContext);
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="toggle" onClick={handleToggleClick}>
        <GiHamburgerMenu />
      </div>

      <div>
        <InvoiceForm className="" />
      </div>
    </div>
  );
};

export default InvoicePage;

import React, { useContext} from "react";
import { DashboardContext } from "../Dashboard";
import { GiHamburgerMenu } from "react-icons/gi";
import InvoiceVisible from "../../components/invoice/InvoiceVisible";


const InvoiceViewOne = () => {


  const { handleToggleClick } = useContext(DashboardContext);
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="toggle" onClick={handleToggleClick}>
        <GiHamburgerMenu />
      </div>

      <div>

        <InvoiceVisible />
      </div>
    </div>
  );
};

export default InvoiceViewOne;

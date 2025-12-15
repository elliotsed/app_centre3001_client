import { useContext, useState } from "react";
import { DashboardContext } from "../Dashboard";
import { GiHamburgerMenu } from "react-icons/gi";
import InvoiceTable from "../../components/invoice/InvoiceTable";

const InvoicePage = () => {
  const [page, setPage] = useState(true);

  
  const { handleToggleClick } = useContext(DashboardContext);
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="toggle" onClick={handleToggleClick}>
        <GiHamburgerMenu />
      </div>

      <div>
       
       
          {/* <InvoiceTable emitEvent={handleEventFromChild} /> */}
       
          <InvoiceTable />
      
      </div>
    </div>
  );
};

export default InvoicePage;

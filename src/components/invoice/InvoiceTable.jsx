import React, { useState, useEffect } from "react";
import { FaEdit, FaDownload } from "react-icons/fa";
import { Rings } from "react-loader-spinner";
import { fetchInvoices } from "../../api/invoicesApi";

const InvoiceTable = ({ emitEvent }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Pagination - 10 items per page

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetchInvoices();
        console.log("les dats", response.data); 
        setInvoices(response.data?.reverse());
        setFilteredInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(value) ||
        invoice.deliveryAddress.name.toLowerCase().includes(value)
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to first page when search is applied
  };

  // Logic to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateEditInvoice = (id) =>{

    console.log(id);


  }

  // Get current invoices for the page
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const handleCreateInvoice = () => {
    if (emitEvent) {
      
         emitEvent();
        
    } else {
      console.error("emitEvent is not a function");
    }
  };

  return (
    <div className="p-4">
      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Rings color="#3498db" height={80} width={80} />
        </div>
      ) : (
        <>
          {/* Header with Filters and Button */}
          <div className="flex flex-col-reverse md:flex-row  gap-3 justify-between items-center mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher..."
                className="border outline-none focus:ring-2 focus-brightColor rounded px-4 py-2 text-sm w-64"
              />
            </div>
            <button
              onClick={handleCreateInvoice()}
              className="bg-primaryColor text-white px-4 py-2 rounded hover:bg-opacity-80"
            >
              Faire une facture
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border border-gray-300">
                    Numéro de facture #
                  </th>
                  <th className="px-6 py-4 border border-gray-300">
                    Noms du client
                  </th>
                  <th className="px-6 py-4 border border-gray-300">
                    Date de facturation
                  </th>
                  <th className="px-6 py-4 border border-gray-300">Total</th>
                  <th className="px-6 py-4 border border-gray-300 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border border-gray-300">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      {invoice.deliveryAddress.name}
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      ${invoice.totalInclTax}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-center">
                      <button
                        onClick={() =>
                            handleCreateEditInvoice(invoice.id)

                        }
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        title="Update Invoice"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          console.log(`Downloading invoice: ${invoice.id}`)
                        }
                        className="text-green-500 hover:text-green-700"
                        title="Download Invoice"
                      >
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredInvoices.length / itemsPerPage)
              }
              className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceTable;

import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { Rings } from "react-loader-spinner";
import { fetchInvoices } from "../../api/invoicesApi";
import { Link } from "react-router-dom";
import InvoiceForm from "./InvoiceForm";
import InvoiceRecord from "./InvoiceReceipt";
import html2pdf from "html2pdf.js";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [pdfVisible, setPdfVisible] = useState(false); // State to control PDF visibility
  const invoiceRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchInvoices();
        console.log("les datas", response.data);
        const reversedInvoices = response.data?.reverse();
        setInvoices(reversedInvoices);
        setFilteredInvoices(reversedInvoices);
        console.log("voici filtre", invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dépendance directe à show

  const handleDownloadPDF = (invoice) => {
    const element = invoiceRefs.current[invoice._id];
    if (!element) return;

    const options = {
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },

      pagebreak: { mode: "avoid" },
    };

    setPdfVisible(true);

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        // Hide the overlay after the download is completed
        setPdfVisible(false);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Hide the overlay even if there was an error
        setPdfVisible(false);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(value) ||
        invoice.deliveryAddress.name.toLowerCase().includes(value)
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = async () => {
    setLoading(true); // Afficher le chargement immédiatement
    try {
      const response = await fetchInvoices();
      const reversedInvoices = response.data?.reverse();
      setInvoices(reversedInvoices);
      setFilteredInvoices(reversedInvoices);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false); // Désactiver le chargement une fois terminé
      setShow(false); // Passer à `false` après le chargement
    }
  };
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices?.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const handleCreateInvoice = () => {
    setShow(true);
  };

  return (
    <div className="p-4">
      {loading ? ( // Priorité à l'indicateur de chargement
        <div className="flex justify-center items-center h-64">
          <Rings color="#3498db" height={80} width={80} />
        </div>
      ) : show ? (
        <InvoiceForm emitEvent={handleBack} />
      ) : (
        <>
          <div className="flex flex-col-reverse md:flex-row gap-3 justify-between items-center mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher..."
                className="border outline-none focus:ring-2 focus:ring-brightColor rounded px-4 py-2 text-sm w-64"
              />
            </div>
            <button
              onClick={handleCreateInvoice}
              className="bg-primaryColor text-white px-4 py-2 rounded hover:bg-opacity-80"
            >
              Faire une facture
            </button>
          </div>

          {filteredInvoices?.length === 0 || filteredInvoices === undefined ? (
            <div className="text-center text-lg text-gray-500">
              Aucune facture disponible
            </div>
          ) : (
            <>
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
                      <th className="px-6 py-4 border border-gray-300">
                        Total
                      </th>
                      <th className="px-6 py-4 border border-gray-300 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoices?.map((invoice, index) => (
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
                          <div
                            ref={(el) =>
                              (invoiceRefs.current[invoice._id] = el)
                            }
                            style={{
                              display: pdfVisible ? "flex" : "none",
                            }}
                          >
                            <InvoiceRecord data={invoice} />
                          </div>
                          <Link to={`/dashboard/view-facture/${invoice._id}`}>
                            <button className="text-primaryColor hover:text-blue-700 mr-4">
                              <FaEye />
                            </button>
                          </Link>

                          <Link to={`/dashboard/facture/${invoice._id}`}>
                            <button
                              className="text-blue-500 hover:text-blue-700 mr-4"
                              title="Update Invoice"
                            >
                              <FaEdit />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleDownloadPDF(invoice)}
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

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredInvoices?.length / itemsPerPage)
                  }
                  className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Suivant
                </button>
              </div>
            </>
          )}

          {pdfVisible && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-90 z-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl">Downloading PDF...</h2>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceTable;

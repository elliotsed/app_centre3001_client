import React, { useRef, useState, useEffect } from "react";
import InvoiceRecord from "./InvoiceReceipt";
import { FaDownload, FaEdit, FaList } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchInvoice } from "../../api/invoicesApi";

const InvoiceVisible = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [invoice, setInvoice] = useState({
    orderRef: "",
    orderDate: "",
    products: [
      {
        reference: "",
        name: "",
        unitPriceExclTax: "",
        quantity: "",
        taxRateOne: 0,
        taxRateTwo: 0,
        totalExclTax: "",
      },
    ],
    carrierName: "",
    shippingFees: 0,
    paymentMethod: "",
    totalProductsExclTax: 0,
    totalTax: 0,
    totalInclTax: 0,
    deliveryAddress: {
      name: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  const [loading, setLoading] = useState(true); // State for loader

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchInvoice(id);
        console.log("Data fetched:", response.data);
        setInvoice(response.data);
        setLoading(false); // Data fetched, stop loading
      } catch (error) {
        console.error("Error fetching invoices:", error);
        navigate("/notfound");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    const options = {
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(invoiceRef.current).set(options).save();
  };

  return (
    <div className="mx-3">
      {loading ? (
        // Loader displayed while fetching data
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        // Display content once data is loaded
        <div className="">
          <div className="flex justify-end items-center gap-3 mb-3">
            <Link
              to="/dashboard/facture"
              className="flex items-center p-3 bg-primaryColor font-sans text-white rounded-lg hover:bg-opacity-80 transition duration-200 ease-in-out"
            >
              <FaList className="mr-2" />
              Liste de facture
            </Link>
            <Link
              to={`/dashboard/facture/${invoice._id}`}
              className="flex items-center p-3 bg-primaryColor font-sans text-white rounded-lg hover:bg-opacity-80 transition duration-200 ease-in-out"
            >
              <FaEdit className="mr-2" />
              Modifier la facture
            </Link>
            <div className="flex justify-end ">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center p-3 bg-primaryColor font-sans text-white rounded-lg hover:bg-opacity-80 transition duration-200 ease-in-out"
              >
                <FaDownload className="mr-2" />
                Télécharger
              </button>
            </div>
          </div>

          <div ref={invoiceRef} className="invoice-container">
            <InvoiceRecord data={invoice} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceVisible;

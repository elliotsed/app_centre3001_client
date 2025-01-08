import React, {useRef , useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  DocumentIcon,
  ShoppingCartIcon,
  TruckIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import SummaryTable from "./SummaryTable";
import InvoiceRecord from "./InvoiceReceipt";

const InvoiceForm = () => {
   const invoiceRef = useRef();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [download, setDownload] = useState(false);
  const [dataDownload, setDataDownload] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleDownloadPDF = () => {
    const options = {
      margin: 1,
      filename: `Invoice_${dataDownload.invoiceNumber}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(invoiceRef.current).set(options).save();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const addProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        {
          reference: "",
          name: "",
          unitPriceExclTax: "",
          quantity: "",
          taxRateOne: "",
          taxRateTwo: "",
          totalExclTax: "",
        },
      ],
    }));
  };

  // Validation functions for each step
  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.orderRef)
      newErrors.orderRef = "Référence de commande est requise.";
    if (!formData.orderDate)
      newErrors.orderDate = "Date de commande est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    formData.products.forEach((product, index) => {
      if (!product.reference)
        newErrors[`product-${index}-reference`] = "Référence est requise.";
      if (!product.name) newErrors[`product-${index}-name`] = "Nom est requis.";
      if (!product.unitPriceExclTax && product.unitPriceExclTax < 0)
        newErrors[`product-${index}-unitPriceExclTax`] =
          "Prix unitaire est requis et superieur a 0.";
      if (!product.quantity || product.quantity < 0)
        newErrors[`product-${index}-quantity`] = "Quantité est requise et superieur a 0.";
      if (!product.taxRateOne || product.taxRateOne < 0)
        newErrors[`product-${index}-taxRateOne`] =
          "le taux de tax une est requise et superieur a 0.";
      if (!product.taxRateTwo || product.taxRateTwo < 0)
        newErrors[`product-${index}-taxRateTwo`] =
          "le taux de tax deux est requise et superieur a 0.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepThree = () => {
    const newErrors = {};

    // Validate carrierName
    if (!formData.carrierName)
      newErrors.carrierName = "Nom du transporteur est requis.";

    // Validate shippingFees
    if (!formData.shippingFees && formData.shippingFees !== 0)
      newErrors.shippingFees = "Frais d'expédition sont requis.";

    // Validate paymentMethod
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Méthode de paiement est requise.";

    // Validate deliveryAddress fields
    if (!formData.deliveryAddress.name)
      newErrors.deliveryAddressName = "Le nom est requis.";
    if (!formData.deliveryAddress.address)
      newErrors.deliveryAddressAddress = "L'adresse est requise.";
    if (!formData.deliveryAddress.city)
      newErrors.deliveryAddressCity = "La ville est requise.";
    if (!formData.deliveryAddress.province)
      newErrors.deliveryAddressProvince = "La province est requise.";
    if (!formData.deliveryAddress.postalCode)
      newErrors.deliveryAddressPostalCode = "Le code postal est requis.";
    if (!formData.deliveryAddress.country)
      newErrors.deliveryAddressCountry = "Le pays est requis.";

    // Set the error messages
    setErrors(newErrors);

    // Return whether there are any errors
    return Object.keys(newErrors).length === 0;
  };

  let isValid = false;
  const handleNext = () => {
    if (step === 1) isValid = validateStepOne();
    if (step === 2) isValid = validateStepTwo();
    if (step === 3) isValid = validateStepThree();

    if (isValid) setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStepThree()) {
      console.log("Form data submitted:", formData);
      // alert("Formulaire soumis avec succès !");
      axios
        .post("http://localhost:3000/gestion_contact/invoices", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("i am here", res);
          setDataDownload(res.data?.data)
          setDownload(true)
          //  if (res.data.success) {
          toast.success("Facture creer est telecharge", {
            position: "top-right",
            autoClose: 5000,
          });

          //  }
        })
        .catch((err) => {
          //  if (err.response.data.errors) {

          //  }
          toast.error("une erreur", {
            position: "top-right",
            autoClose: 5000,
          });
          console.log("nous somme ici ", err);
        });
    }
  };

  const steps = [
    { label: "Détails commande", icon: <DocumentIcon className="h-5 w-5" /> },
    {
      label: "Détails produit",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
    },
    { label: "Livraison", icon: <TruckIcon className="h-5 w-5" /> },
    { label: "Résumé", icon: <CheckCircleIcon className="h-5 w-5" /> },
  ];
   

  return (
    <div className="md:bg-white p-2 md:p-8 font-sans mb-10 md:shadow-md rounded-lg md:mx-3 lg:mx-10">
      <h2 className="text-xl md:text-2xl font-bold text-center md:text-start text-gray-700 mb-6">
        Créer une facture
      </h2>

      {/* Step Indicator */}
      {!download ? (
        <>
          <div className="flex justify-between border-b font-medium gap-4 mb-8">
            {steps.map((stepData, index) => (
              <div
                key={index}
                className={`flex w-full text-center py-2.5 text-gray-700 justify-center gap-3 items-center  ${
                  step === index + 1
                    ? "border-b-2 border-primaryColor text-[#057979]"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`flex items-center justify-center p-2 rounded-full ${
                    step === index + 1
                      ? "bg-primaryColor text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {stepData.icon}
                </div>
                <div className="hidden md:flex">{stepData.label}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Référence de commande
                  </label>
                  <input
                    type="text"
                    name="orderRef"
                    value={formData.orderRef}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                      errors.orderRef
                        ? " ring-2 ring-red-500 "
                        : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                    }`}
                  />
                  {errors.orderRef && (
                    <p className="text-sm text-red-500">{errors.orderRef}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date de commande
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                      errors.orderDate
                        ? " ring-2 ring-red-500 "
                        : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                    }`}
                  />
                  {errors.orderDate && (
                    <p className="text-sm text-red-500">{errors.orderDate}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                {formData.products.map((product, index) => (
                  <div
                    key={index}
                    className="border p-4 md:p-8 rounded-lg bg-white shadow"
                  >
                    <h4 className="text-lg flex gap-3 font-semibold text-gray-600">
                      <span className="w-5 h-5 text-white bg-primaryColor flex items-center justify-center p-4 rounded-full ">
                        {index + 1}
                      </span>
                      Produit
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Référence
                        </label>
                        <input
                          type="text"
                          name="reference"
                          value={product.reference}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-reference`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-reference`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-reference`]}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nom du produit
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-name`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-name`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-name`]}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Prix unitaire
                        </label>
                        <input
                          type="number"
                          name="unitPriceExclTax"
                          value={product.unitPriceExclTax}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-unitPriceExclTax`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-unitPriceExclTax`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-unitPriceExclTax`]}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Quantite
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-quantity`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-quantity`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-quantity`]}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Taux De taxe une
                        </label>
                        <input
                          type="number"
                          name="taxRateOne"
                          value={product.taxRateOne}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-taxRateOne`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-taxRateOne`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-taxRateOne`]}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Taux De taxe deux
                        </label>
                        <input
                          type="number"
                          name="taxRateTwo"
                          value={product.taxRateTwo}
                          onChange={(e) => handleProductChange(index, e)}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors[`product-${index}-taxRateTwo`]
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors[`product-${index}-taxRateTwo`] && (
                          <p className="text-sm text-red-500">
                            {errors[`product-${index}-taxRateTwo`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProduct}
                  className="px-4 py-2 bg-primaryColor text-white rounded-lg"
                >
                  Ajouter Produit
                </button>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.deliveryAddress.name}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          name: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressName
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.deliveryAddressName && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.deliveryAddress.address}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          address: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressAddress
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.deliveryAddressAddress && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressAddress}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.deliveryAddress.city}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          city: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressCity
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.deliveryAddressCity && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressCity}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.deliveryAddress.province}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          province: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressProvince
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {<errors className="deliveryAddressProvince"></errors> && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressProvince}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Code Postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.deliveryAddress.postalCode}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          postalCode: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressPostalCode
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.deliveryAddressPostalCode && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressPostalCode}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.deliveryAddress.country}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.deliveryAddress,
                          country: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          deliveryAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.deliveryAddressCountry
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.deliveryAddressCountry && (
                      <p className="text-sm text-red-500">
                        {errors.deliveryAddressCountry}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Transporteur
                    </label>
                    <input
                      type="text"
                      name="carrierName"
                      value={formData.carrierName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.carrierName
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.carrierName && (
                      <p className="text-sm text-red-500">
                        {errors.carrierName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Frais de livraison
                    </label>
                    <input
                      type="number"
                      name="shippingFees"
                      value={formData.shippingFees}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.shippingFees
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.shippingFees && (
                      <p className="text-sm text-red-500">
                        {errors.shippingFees}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Moyen de paiement
                    </label>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.paymentMethod
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.paymentMethod && (
                      <p className="text-sm text-red-500">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 4 && <SummaryTable formData={formData} />}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Précédent
                </button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
                >
                  Suivant
                </button>
              )}
              {step === 4 && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
                >
                  Soumettre
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center p-3 bg-primaryColor font-sans text-white rounded-lg hover:bg-opacity-80 transition duration-200 ease-in-out"
          >
            <FaDownload className="mr-2" />
            Télécharger la facture en PDF
          </button>

          <div ref={invoiceRef} className="invoice-container">
            <InvoiceRecord data={dataDownload} />
          </div>
        </>
      )}
    </div>
    
  );
};

export default InvoiceForm;

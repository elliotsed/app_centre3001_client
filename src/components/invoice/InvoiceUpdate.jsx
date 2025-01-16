import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { fetchInvoice, updateInvoice } from "../../api/invoicesApi";
import {
  DocumentIcon,
  ShoppingCartIcon,
  TruckIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from "@heroicons/react/outline";
import SummaryTable from "./SummaryTable";
import InvoiceRecord from "./InvoiceReceipt";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const InvoiceUpdate = () => {
  const invoiceRef = useRef();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [download, setDownload] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [dataDownload, setDataDownload] = useState(false);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    orderRef: "",
    orderDate: "",
    products: [
      {
        reference: "",
        name: "",
        unitPriceExclTax: "",
        quantity: "",
        totalExclTax: "",
      },
    ],
    carrierName: "",
    shippingFees: 0,
    taxRateOne: 0,
    taxRateTwo: 0,
    taxRate: 0,
    paymentMethod: "",
    totalProductsExclTax: 0,
    totalTax: 0,
    totalInclTax: 0,
    deliveryAddress: {
      name: "",
      doorNumberStreet: "",
      provinceCountry: "",
      municipalityPostalCode: "",
      extraInfo: "",
      telephone: 0,
    },
    billingAddress: {
      name: "",
      doorNumberStreet: "",
      provinceCountry: "",
      municipalityPostalCode: "",
      extraInfo: "",
      telephone: 0,
    },
  });

  const removeProduct = (indexToRemove) => {
    setFormData((prevData) => {
      if (prevData.products.length <= 1) {
        alert("vous devez avoir aumoins un produit");
        return prevData;
      }

      const updatedProducts = prevData.products.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevData,
        products: updatedProducts,
      };
    });
  };
  const handleIdentique = () => {
    formData.deliveryAddress = formData.billingAddress;
    setShowDelivery(!showDelivery);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchInvoice(id);
        console.log("les dats", response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        navigate("/notfound");
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const options = {
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
          totalExclTax: "",
        },
      ],
    }));
  };

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
    if (!formData.taxRateOne || formData.taxRateOne < 0)
      newErrors.taxRateOne =
        "le taux de tax tvq une est requise et superieur a 0.";
    if (!formData.taxRateTwo || formData.taxRateTwo < 0)
      newErrors.taxRateTwo =
        "le taux de tax tps deux est requise et superieur a 0.";
    formData.products.forEach((product, index) => {
      if (!product.reference)
        newErrors[`product-${index}-reference`] = "Référence est requise.";
      if (!product.name) newErrors[`product-${index}-name`] = "Nom est requis.";
      if (!product.unitPriceExclTax || product.unitPriceExclTax < 0)
        newErrors[`product-${index}-unitPriceExclTax`] =
          "Prix unitaire est requis et superieur a 0.";
      if (!product.quantity || product.quantity < 0)
        newErrors[`product-${index}-quantity`] =
          "Quantité est requise et superieur a 0.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepThree = () => {
    const newErrors = {};
    if (!formData.billingAddress.name)
      newErrors.billingAddressName = "Le nom est requis.";
    if (!formData.billingAddress.doorNumberStreet)
      newErrors.billingAddressDoorNumberStreet =
        "Le Numéro de porte et la Rue sont requisent.";
    if (!formData.billingAddress.provinceCountry)
      newErrors.billingAddressProvinceCountry =
        "Le Pays et la Province sont requisent.";
    if (!formData.billingAddress.municipalityPostalCode)
      newErrors.billingAddressMunicipalityPostalCode =
        "La Municipalité et le Code postal sont requisent.";
    if (
      !formData.billingAddress.telephone ||
      formData.billingAddress.telephone < 0
    )
      newErrors.billingAddressTelephone = "Le numero de telephone est requis.";

    // Set the error messages
    setErrors(newErrors);

    // Return whether there are any errors
    return Object.keys(newErrors).length === 0;
  };
  const validateStepFour = () => {
    const newErrors = {};

    if (!formData.carrierName)
      newErrors.carrierName = "Nom du transporteur est requis.";

    if (!formData.shippingFees && formData.shippingFees !== 0)
      newErrors.shippingFees = "Frais d'expédition sont requis.";

    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Méthode de paiement est requise.";

    if (!formData.deliveryAddress.name)
      newErrors.deliveryAddressName = "Le nom est requis.";
    if (!formData.deliveryAddress.doorNumberStreet)
      newErrors.deliveryAddressDoorNumberStreet =
        "Le Numéro de porte et la Rue sont requisent.";
    if (!formData.deliveryAddress.provinceCountry)
      newErrors.deliveryAddressProvinceCountry =
        "Le Pays et la Province sont requisent.";
    if (!formData.deliveryAddress.municipalityPostalCode)
      newErrors.deliveryAddressMunicipalityPostalCode =
        "La Municipalité et le Code postal sont requisent.";
    if (
      !formData.deliveryAddress.telephone ||
      formData.deliveryAddress.telephone < 0
    )
      newErrors.deliveryAddressTelephone = "Le numero de telephone est requis.";

    // Set the error messages
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  let isValid = false;
  const handleNext = () => {
    if (step === 1) isValid = validateStepOne();
    if (step === 2) isValid = validateStepTwo();
    if (step === 3) isValid = validateStepThree();
    if (step === 4) isValid = validateStepFour();

    if (isValid) setStep((prevStep) => prevStep + 1);
  };
  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStepThree()) {
      console.log("Form data submitted:", formData);
      try {
        const response = await updateInvoice(id, formData);
        setDataDownload(response?.data);
        setDownload(true);
        toast.success("Facture modifier avec success", {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {
        toast.error("une erreur", {
          position: "top-right",
          autoClose: 5000,
        });
        console.log(error);
      }
    }
  };

  const steps = [
    { label: "Commande", icon: <DocumentIcon className="h-5 w-5" /> },
    {
      label: "Produit",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
    },
    { label: "Facturation", icon: <CreditCardIcon className="h-5 w-5" /> },
    { label: "Livraison", icon: <TruckIcon className="h-5 w-5" /> },
    { label: "Résumé", icon: <CheckCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="md:bg-white p-2 md:p-8 font-sans mb-10 md:shadow-md rounded-lg md:mx-3 lg:mx-10">
      <div className="flex  flex-col md:flex-row gap-3 justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-center md:text-start text-gray-700 mb-6">
          Modifier une facture
        </h2>
        <div>
          <Link
            to="/dashboard/facture"
            className="bg-primaryColor text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            Liste de facture
          </Link>
        </div>
      </div>

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
                <h3 className="font-sans font-semibold text-gray-700">
                  Detail de Commande :
                </h3>
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
                <div className="grid gird-cols-1 gap-3 items-center">
                  <h4 className="text-lg flex gap-3 font-semibold text-gray-600">
                    Taxe
                  </h4>
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-3 items-center">
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        TPS
                      </label>
                      <input
                        type="number"
                        name="taxRateOne"
                        value={formData.taxRateOne}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none ${
                          errors.taxRateOne
                            ? " ring-2 ring-red-500 "
                            : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                        }`}
                      />
                      {errors.taxRateOne && (
                        <p className="text-sm text-red-500">
                          {errors.taxRateOne}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        TVQ
                      </label>
                      <input
                        type="number"
                        name="taxRateTwo"
                        value={formData.taxRateTwo}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none ${
                          errors.taxRateTwo
                            ? " ring-2 ring-red-500 "
                            : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                        }`}
                      />
                      {errors.taxRateTwo && (
                        <p className="text-sm text-red-500">
                          {errors.taxRateTwo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {formData.products.map((product, index) => (
                  <div
                    key={index}
                    className="border p-4 md:p-8 rounded-lg bg-white shadow"
                  >
                    <div className="flex justify-between">
                      <h4 className="text-lg flex gap-3 font-semibold text-gray-600">
                        <span className="w-5 h-5 text-white bg-primaryColor flex items-center justify-center p-4 rounded-full ">
                          {index + 1}
                        </span>
                        Produit
                      </h4>
                      <button
                        onClick={() => removeProduct(index)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>

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
                <h3 className="font-sans font-semibold text-gray-700">
                  Address de Facturation :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.billingAddress.name}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          name: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.billingAddressName
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.billingAddressName && (
                      <p className="text-sm text-red-500">
                        {errors.billingAddressName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Numéro de porte et Rue
                    </label>
                    <input
                      type="text"
                      name="doorNumberStreet"
                      value={formData.billingAddress.doorNumberStreet}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          doorNumberStreet: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.billingAddressDoorNumberStreet
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.billingAddressDoorNumberStreet && (
                      <p className="text-sm text-red-500">
                        {errors.billingAddressDoorNumberStreet}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Municipalité et Code postal
                    </label>
                    <input
                      type="text"
                      name="municipalityPostalCode"
                      value={formData.billingAddress.municipalityPostalCode}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          municipalityPostalCode: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.billingAddressMunicipalityPostalCode
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.billingAddressMunicipalityPostalCode && (
                      <p className="text-sm text-red-500">
                        {errors.billingAddressMunicipalityPostalCode}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pays et Province
                    </label>
                    <input
                      type="text"
                      name="provinceCountry"
                      value={formData.billingAddress.provinceCountry}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          provinceCountry: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.billingAddressProvinceCountry
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {<errors className="deliveryAddressProvince"></errors> && (
                      <p className="text-sm text-red-500">
                        {errors.billingAddressProvinceCountry}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      value={formData.billingAddress.telephone}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          telephone: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg outline-none ${
                        errors.billingAddressTelephone
                          ? " ring-2 ring-red-500 "
                          : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                      }`}
                    />
                    {errors.billingAddressTelephone && (
                      <p className="text-sm text-red-500">
                        {errors.billingAddressTelephone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Autre
                    </label>
                    <input
                      type="text"
                      name="extraInfo"
                      value={formData.billingAddress.extraInfo}
                      onChange={(e) => {
                        const updatedAddress = {
                          ...formData.billingAddress,
                          extraInfo: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          billingAddress: updatedAddress,
                        });
                      }}
                      className="w-full px-4 py-2 border rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-sans font-semibold text-gray-700">
                  Address de Livraison :
                </h3>
                <div className="flex gap-3 items-center justify-end">
                  <button
                    className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80 cursor-pointer"
                    onClick={handleIdentique}
                    type="button"
                  >
                    identique
                  </button>
                  <p className="text-xs italic">
                    Si l'adresse de livraison est égale à l'adresse de
                    facturation, cliquez sur le bouton
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showDelivery ? (
                    <></>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nom complet
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
                          Numéro de porte et Rue
                        </label>
                        <input
                          type="text"
                          name="doorNumberStreet"
                          value={formData.deliveryAddress.doorNumberStreet}
                          onChange={(e) => {
                            const updatedAddress = {
                              ...formData.deliveryAddress,
                              doorNumberStreet: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              deliveryAddress: updatedAddress,
                            });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors.deliveryAddressDoorNumberStreet
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors.deliveryAddressDoorNumberStreet && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryAddressDoorNumberStreet}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Municipalité et Code postal
                        </label>
                        <input
                          type="text"
                          name="municipalityPostalCode"
                          value={
                            formData.deliveryAddress.municipalityPostalCode
                          }
                          onChange={(e) => {
                            const updatedAddress = {
                              ...formData.deliveryAddress,
                              municipalityPostalCode: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              deliveryAddress: updatedAddress,
                            });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors.deliveryAddressMunicipalityPostalCode
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors.deliveryAddressMunicipalityPostalCode && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryAddressMunicipalityPostalCode}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Pays et Province
                        </label>
                        <input
                          type="text"
                          name="provinceCountry"
                          value={formData.deliveryAddress.provinceCountry}
                          onChange={(e) => {
                            const updatedAddress = {
                              ...formData.deliveryAddress,
                              provinceCountry: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              deliveryAddress: updatedAddress,
                            });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors.deliveryAddressProvinceCountry
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {(
                          <errors className="deliveryAddressProvince"></errors>
                        ) && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryAddressProvinceCountry}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        <input
                          type="number"
                          name="telephone"
                          value={formData.deliveryAddress.telephone}
                          onChange={(e) => {
                            const updatedAddress = {
                              ...formData.deliveryAddress,
                              telephone: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              deliveryAddress: updatedAddress,
                            });
                          }}
                          className={`w-full px-4 py-2 border rounded-lg outline-none ${
                            errors.deliveryAddressTelephone
                              ? " ring-2 ring-red-500 "
                              : "border-gray-300 focus:ring-2 focus:ring-brightColor "
                          }`}
                        />
                        {errors.deliveryAddressTelephone && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryAddressTelephone}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Autre
                        </label>
                        <input
                          type="text"
                          name="extraInfo"
                          value={formData.deliveryAddress.extraInfo}
                          onChange={(e) => {
                            const updatedAddress = {
                              ...formData.deliveryAddress,
                              extraInfo: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              deliveryAddress: updatedAddress,
                            });
                          }}
                          className="w-full px-4 py-2 border rounded-lg outline-none"
                        />
                      </div>
                    </>
                  )}

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
            {step === 5 && <SummaryTable formData={formData} />}

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
              {step < 5 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
                >
                  Suivant
                </button>
              )}
              {step === 5 && (
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
          <div className="flex justify-end mb-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center p-3 bg-primaryColor font-sans text-white rounded-lg hover:bg-opacity-80 transition duration-200 ease-in-out"
            >
              <FaDownload className="mr-2" />
              Télécharger
            </button>
          </div>

          <div ref={invoiceRef} className="invoice-container">
            <InvoiceRecord data={dataDownload} />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceUpdate;

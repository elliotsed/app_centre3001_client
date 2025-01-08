import React from "react";

const InvoiceRecord = ({ data }) => {
  const {
    invoiceNumber,
    issueDate,
    orderRef,
    orderDate,
    deliveryAddress,
    products,
    carrierName,
    shippingFees,
    paymentMethod,
    totalProductsExclTax,
    totalTax,
    totalInclTax,
  } = data;

  return (
    <div className=" shadow-md  w-full font-sans md:mx-3 font-sans p-8 bg-white ">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">FACTURE</h1>
          <div className="text-black">
            <p>{new Date(issueDate).toLocaleDateString()}</p>
            <p className="font-semibold">#{invoiceNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <img src="/api/placeholder/150/50" alt="Logo" className="mb-2" />
          <p>{deliveryAddress.name}</p>
          <p>{deliveryAddress.address}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className=" p-4 ">
          <h2 className="font-semibold mb-2">Adresse de livraison</h2>
          <div className="text-black italic">
            <p>
              <span className="mr-2 font-medium">Noms: </span>
              {deliveryAddress.name}
            </p>
            <p>
              <span className="mr-2 font-medium">Addresse: </span>
              {deliveryAddress.postalCode} ,{deliveryAddress.address}
            </p>
            <p>
              <span className="mr-2 font-medium">Ville: </span>{" "}
              {deliveryAddress.city} {deliveryAddress.province}
            </p>
            <p>
              {" "}
              <span className="mr-2 font-medium">Pays: </span>{" "}
              {deliveryAddress.country}
            </p>
          </div>
        </div>
        <div className=" p-4">
          <h2 className="font-semibold mb-2 ">Adresse de facturation</h2>
          <div className="text-black italic">
            <p>
              <span className="mr-2 font-medium">Noms: </span>
              {deliveryAddress.name}
            </p>
            <p>
              <span className="mr-2 font-medium">Addresse: </span>
              {deliveryAddress.postalCode} ,{deliveryAddress.address}
            </p>
            <p>
              <span className="mr-2 font-medium">Ville: </span>{" "}
              {deliveryAddress.city} {deliveryAddress.province}
            </p>
            <p>
              {" "}
              <span className="mr-2 font-medium">Pays: </span>{" "}
              {deliveryAddress.country}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-t-lg">
          <div className="">
            <p className=" font-semibold text-black">Numéro de facture</p>
            <p>#{invoiceNumber}</p>
          </div>
          <div>
            <p className=" font-semibold text-black">Date de facturation</p>
            <p>{new Date(issueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className=" font-semibold text-black">Réf. de commande</p>
            <p>{orderRef}</p>
          </div>
          <div>
            <p className=" font-semibold text-black">Date de commande</p>
            <p>{new Date(orderDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-4">Référence</th>
              <th className="text-left p-4">Produit</th>
              <th className="text-left p-4">Taux de taxe</th>
              <th className="text-right p-4">Prix unitaire (HT)</th>
              <th className="text-right p-4">Quantité</th>
              <th className="text-right p-4">Total (HT)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-4">{product.reference}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">
                  {product.taxRateOne}%, {product.taxRateTwo}%
                </td>
                <td className="text-right p-4">{product.unitPriceExclTax} $</td>
                <td className="text-right p-4">{product.quantity}</td>
                <td className="text-right p-4">{product.totalExclTax} $</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-2">
            <table className="w-full border-collapse border border-gray-300 text-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4"> Détail des taxes</th>
                  <th className="text-left p-4">Taux de taxe</th>
                  <th className="text-left p-4">Taxe totale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className=" px-4 py-2 ">Produits</td>
                  <td className=" px-4 py-2 ">{products[0].taxRateTwo}</td>
                  <td className="px-4 py-2">
                    {totalProductsExclTax * (products[0].taxRateTwo / 100)} $
                  </td>
                </tr>
                <tr>
                  <td className=" px-4 py-2 "></td>
                  <td className=" px-4 py-2 ">{products[0].taxRateOne}</td>
                  <td className="px-4 py-2">
                    {totalProductsExclTax * (products[0].taxRateOne / 100)} $
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2">
            <table className="w-full border-collapse border border-gray-300 text-sm text-left">
              <tbody>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Moyen de paiement
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {paymentMethod} - {totalInclTax} $
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Transporteur
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {carrierName}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <table className="w-full border-collapse border border-gray-300 text-sm text-right  ">
            <tbody className="">
              <tr className="">
                <th className=" font-normal  px-4 py-3 bg-gray-100 text-gray-700">
                  Total produits
                </th>
                <td className="px-4 py-2">{totalProductsExclTax} $</td>
              </tr>
              <tr className="">
                <th className=" font-normal px-4 py-3 bg-gray-100 text-gray-700">
                  Frais de livraison
                </th>
                <td className=" px-4 py-2">
                  {shippingFees === 0 ? "gratuit" : `${shippingFees} $`}
                </td>
              </tr>
              <tr className="">
                <th className=" px-4 py-3 bg-gray-100 text-gray-700">
                  Total (HT)
                </th>
                <td className=" px-4 py-2">{totalProductsExclTax} $</td>
              </tr>
              <tr>
                <th className=" px-4 py-3 bg-gray-100 text-gray-700">
                  Taxe totale
                </th>
                <td className=" px-4 py-2">{totalTax} $</td>
              </tr>
              <tr>
                <th className=" px-4 py-2 bg-gray-100 text-gray-700">Total</th>
                <td className=" px-4 py-2">{totalInclTax} $</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-8 border-t text-center text-black text-sm">
        <p className="mb-2">
          Pour Total (HT)toute assistance, merci de nous contacter :
        </p>
        <p>Tél. : 1877 545 19 99</p>
      </div>
    </div>
  );
};

export default InvoiceRecord;

import React from "react";
import logo1 from "../../assets/image1.png";
import logo2 from "../../assets/image2.png";
const InvoiceRecord = ({ data }) => {
  const {
    invoiceNumber,
    issueDate,
    orderRef,
    orderDate,
    deliveryAddress,
    billingAddress,
    products,
    carrierName,
    shippingFees,
    taxRateOne,
    taxRateTwo,
    totalsExclTax,
    paymentMethod,
    totalProductsExclTax,
    totalTax,
    totalInclTax,
  } = data;

  return (
    <div className=" shadow-md  w-full font-sans md:mx-3 font-sans p-8 bg-white ">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">FACTURE</h1>
          <div className="text-black">
            <p>{new Date(issueDate).toLocaleDateString()}</p>
            <p className="font-semibold">#{invoiceNumber}</p>
          </div>
        </div>
        <div className="text-right flex items-center">
          <img src={logo2} alt="Logo" width={150} className="mb-2" />
          <img src={logo1} alt="Logo" width={150} className="mb-2" />
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mb-4">
        <div className=" p-4 ">
          <h2 className="font-semibold mb-1">Adresse de livraison</h2>
          <div className="text-black italic">
            <p>{deliveryAddress.name}</p>
            <p>{deliveryAddress.doorNumberStreet}</p>
            <p>{deliveryAddress.municipalityPostalCode}</p>
            <p>{deliveryAddress.provinceCountry}</p>
            <p>{deliveryAddress.telephone}</p>
            <p>{deliveryAddress.extraInfo}</p>
          </div>
        </div>
        <div className=" p-4">
          <h2 className="font-semibold mb-1 ">Adresse de facturation</h2>
          <div className="text-black  italic">
            <p>{billingAddress.name}</p>
            <p>{billingAddress.doorNumberStreet}</p>
            <p>{billingAddress.municipalityPostalCode}</p>
            <p>{billingAddress.provinceCountry}</p>
            <p>{billingAddress.telephone}</p>
            <p>{billingAddress.extraInfo}</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-t-lg">
          <div className="">
            <p className=" font-semibold text-black">Numéro de facture</p>
            <p className="text-sm ">#{invoiceNumber}</p>
          </div>
          <div>
            <p className=" font-semibold text-black">Date de facturation</p>
            <p className="text-sm">
              {new Date(issueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className=" font-semibold text-black">Réf. de commande</p>
            <p className="text-sm">{orderRef}</p>
          </div>
          <div>
            <p className=" font-semibold text-black">Date de commande</p>
            <p className="text-sm">
              {new Date(orderDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Référence</th>
              <th className="text-left p-2">Produit</th>
              <th className="text-left p-2">Taux de taxe</th>
              <th className="text-right p-2">Prix unitaire</th>
              <th className="text-right p-2">Quantité</th>
              <th className="text-right p-2">Total </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-b text-sm">
                <td className="p-2">{product.reference}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">
                  {taxRateOne}%, {taxRateTwo}%
                </td>
                <td className="text-right p-2">{product.unitPriceExclTax} $</td>
                <td className="text-right p-2">{product.quantity}</td>
                <td className="text-right p-2">
                  {Number(product.totalExclTax).toFixed(2)} $
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-2">
            <table className="w-full border-collapse border border-gray-300 text-sm text-start">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2"> Détail des taxes</th>
                  <th className="text-left p-2">Taux de taxe</th>
                  <th className="text-left p-2">tax Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className=" px-4 py-2 ">TVQ: 1202201306TQ003</td>
                  <td className=" px-4 py-2 ">{taxRateOne}%</td>
                  <td className="px-4 py-2">
                    {((taxRateOne / 100) * totalsExclTax).toFixed(2)} $
                  </td>
                </tr>
                <tr>
                  <td className=" px-4 py-2 ">TPS:1446407 1RT001 </td>
                  <td className=" px-4 py-2 ">{taxRateTwo}%</td>
                  <td className="px-4 py-2">
                    {((taxRateTwo / 100) * totalsExclTax).toFixed(2)} $
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
                    {paymentMethod} - {Number(totalInclTax).toFixed(2)} $
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
                <td className=" px-4 py-2">
                  {Number(totalsExclTax).toFixed(2)} $
                </td>
              </tr>
              <tr>
                <th className=" px-4 py-3 bg-gray-100 text-gray-700">
                  Taxe totale
                </th>
                <td className=" px-4 py-2">{Number(totalTax).toFixed(2)} $</td>
              </tr>
              <tr>
                <th className=" px-4 py-2 bg-gray-100 text-gray-700">Total</th>
                <td className=" px-4 py-2">
                  {Number(totalInclTax).toFixed(2)}$
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-8 border-t flex flex-col gap-2 text-center text-black text-xs">
        <p className="font-medium">
          Pour toute assistance, merci de nous contacter :
        </p>
        <p>Tél. : +1 877 545 19 99 , +1 418 246 19 99</p>
        <p>248, Chem des pionniers ouest / Cap-St-Ignace G0R 1H0 (Qc)</p>
        <a href="www.aurismagnetic.ca" target="_blank">
          www.aurismagnetic.ca
        </a>
      </div>
    </div>
  );
};

export default InvoiceRecord;

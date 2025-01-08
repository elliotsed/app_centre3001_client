import React from "react";

const SummaryTable = ({ formData }) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">Résumé</h2>

        {/* Order Details */}
        {/* Delivery Address */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <h4 className="text-md font-medium text-gray-700">
              Adresse de livraison
            </h4>
            <table className="w-full border-collapse border border-gray-300 text-sm text-left">
              <tbody>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Nom
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.name}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Adresse
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.address}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Ville
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.city}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Province
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.province}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Code Postal
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.postalCode}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                    Pays
                  </th>
                  <td className="border border-gray-300 px-4 py-2">
                    {formData.deliveryAddress.country}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-medium text-gray-700">Commande</h4>
              <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                      Référence de commande
                    </th>
                    <td className="border border-gray-300 px-4 py-2">
                      {formData.orderRef}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                      Date de commande
                    </th>
                    <td className="border border-gray-300 px-4 py-2">
                      {formData.orderDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-medium text-gray-700">Expédition</h4>
              <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                      Transporteur
                    </th>
                    <td className="border border-gray-300 px-4 py-2">
                      {formData.carrierName}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                      Frais de livraison
                    </th>
                    <td className="border border-gray-300 px-4 py-2">
                      {formData.shippingFees
                        ? formData.shippingFees
                        : "Pas de frais"}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-700">
                      Moyen de paiement
                    </th>
                    <td className="border border-gray-300 px-4 py-2">
                      {formData.paymentMethod}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Products */}
        <h4 className="text-md font-medium text-gray-700">Produits</h4>
        <table className="w-full border-collapse border border-gray-300 text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Référence</th>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Quantité</th>
              <th className="border border-gray-300 px-4 py-2">
                Prix Unitaire HT
              </th>
              <th className="border border-gray-300 px-4 py-2">Taux de Taxe</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.map((product, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {product.reference}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.unitPriceExclTax}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.taxRateOne}, {product.taxRateTwo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;

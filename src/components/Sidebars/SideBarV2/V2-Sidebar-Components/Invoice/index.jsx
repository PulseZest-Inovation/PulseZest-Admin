import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const InvoiceTemplate = () => {
  const [invoiceData, setInvoiceData] = useState({
    date: '2024-08-15',
    invoiceNumber: '000001',
    studentName: '',
    studentEmail: '',
    studentSUID: '',
    products: [{ productName: '', amount: 0, qty: 1, taxAmount: 0 }],
    paymentId: '',
    orderId: '',
    total: '0.00',
  });

  useEffect(() => {
    calculateTotal();
  }, [invoiceData.products]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = invoiceData.products.map((product, i) =>
      i === index ? { ...product, [name]: parseFloat(value) || value } : product
    );
    setInvoiceData({ ...invoiceData, products: updatedProducts });
    calculateTotal();
  };

  const handleAddProduct = () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      products: [...prevState.products, { productName: '', amount: 0, qty: 1, taxAmount: 0 }]
    }));
  };

  const handleRemoveProduct = (index) => {
    setInvoiceData((prevState) => ({
      ...prevState,
      products: prevState.products.filter((_, i) => i !== index)
    }));
    calculateTotal();
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.products.reduce(
      (acc, product) => acc + (product.amount * product.qty),
      0
    );
    const totalTax = invoiceData.products.reduce(
      (acc, product) => acc + product.taxAmount,
      0
    );
    const total = subtotal + totalTax;
    setInvoiceData((prevState) => ({
      ...prevState,
      total: total.toFixed(2),
    }));
  };

  const handleSave = () => {
    alert('Invoice saved successfully!');
  };

  const handlePrint = () => {
    const element = document.getElementById('invoice');
    html2pdf().from(element).save();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-md max-h-screen overflow-y-auto relative pb-20">
      <div className="flex justify-between items-center pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">PulseZest-Learning</h1>
        </div>
        <div className="flex space-x-4">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
            Save
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
            Print Invoice
          </button>
          <button onClick={handleAddProduct} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Add Product
          </button>
        </div>
      </div>

      <div id="invoice" className="space-y-8 mt-4">
        <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-600">PulseZest Learning</h2>
            <p className="text-gray-600">Number: +91 6396219233</p>
            <p className="text-gray-600">Email: info@pulsezest.com</p>
            <p className="text-gray-600">GST IN: 09ILJPK0660Q1ZC</p>
            <p className="text-gray-600">Address: Pashupati Vihar Colony</p>
            <p className="text-gray-600">69/2, Ground Floor</p>
            <p className="text-gray-600">Bareilly, Uttar Pradesh</p>
            <p className="text-gray-600">Pin-243006</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-600">Student Details</h2>
            <input
              type="text"
              name="studentName"
              value={invoiceData.studentName}
              onChange={(e) => setInvoiceData({ ...invoiceData, studentName: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              placeholder="Student Name"
            />
            <input
              type="email"
              name="studentEmail"
              value={invoiceData.studentEmail}
              onChange={(e) => setInvoiceData({ ...invoiceData, studentEmail: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              placeholder="Student Email"
            />
            <input
              type="text"
              name="studentSUID"
              value={invoiceData.studentSUID}
              onChange={(e) => setInvoiceData({ ...invoiceData, studentSUID: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              placeholder="Student SUID"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 bg-gray-100 p-4 rounded-lg">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-blue-600">Invoice Details</h2>
            <p className="text-gray-600">Date: {invoiceData.date}</p>
            <p className="text-gray-600">Invoice Number: {invoiceData.invoiceNumber}</p>
            <p className="text-gray-600">Payment ID: {invoiceData.paymentId}</p>
            <p className="text-gray-600">Order ID: {invoiceData.orderId}</p>
          </div>
        </div>

        <table className="w-full border-collapse mt-4">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 font-semibold text-blue-600 border-b">#</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Product Details</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Amount (₹)</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Qty.</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Tax Amount (₹)</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Total (₹)</th>
              <th className="p-2 font-semibold text-blue-600 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((product, index) => (
              <tr key={index}>
                <td className="p-2 border-b">{index + 1}</td>
                <td className="p-2 border-b">
                  <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Product Name"
                  />
                </td>
                <td className="p-2 border-b">
                  <input
                    type="number"
                    name="amount"
                    value={product.amount}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Amount"
                  />
                </td>
                <td className="p-2 border-b">
                  <input
                    type="number"
                    name="qty"
                    value={product.qty}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Qty"
                  />
                </td>
                <td className="p-2 border-b">
                  <input
                    type="number"
                    name="taxAmount"
                    value={product.taxAmount}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Tax Amount"
                  />
                </td>
                <td className="p-2 border-b">
                  {(product.amount * product.qty + product.taxAmount).toFixed(2)}
                </td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <p className="font-bold">Subtotal (₹): {invoiceData.products.reduce(
            (acc, product) => acc + (product.amount * product.qty),
            0
          ).toFixed(2)}</p>
          <p className="font-bold">Total Tax (₹): {invoiceData.products.reduce(
            (acc, product) => acc + product.taxAmount,
            0
          ).toFixed(2)}</p>
          <p className="font-bold text-lg">Grand Total (₹): {invoiceData.total}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;

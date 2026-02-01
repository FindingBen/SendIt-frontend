import React from 'react'

const ReceiptPurchaseComponent = ({ purchase_obj }) => {
  const purchase = purchase_obj;
  if (!purchase) {
    return <div className="text-center p-4">No purchase data available</div>
  }

  const { customer_details, line_items, amount_subtotal, amount_total, currency, payment_status, total_details, branding_settings } = purchase

  // Assuming line_items.data is an array of items
  const items = line_items?.data || []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'usd',
    }).format(amount / 100) // Assuming amount is in cents
  }

  const bgColor = branding_settings?.background_color || '#ffffff'
  const buttonColor = branding_settings?.button_color || '#0074d4'
  const displayName = branding_settings?.display_name || 'Sendperplane'

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div 
        className="text-white p-4 text-center relative"
        style={{ backgroundColor: buttonColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
          <p className="text-sm opacity-90">Purchase Receipt</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6" style={{ backgroundColor: bgColor }}>
        
        {/* Items Purchased */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Items Purchased
          </h2>
          {items.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <div key={index} className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.description || item.price?.product_data?.name || 'Item'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.amount_total || item.price?.unit_amount * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">No items listed</p>
          )}
        </div>
        
        {/* Pricing Breakdown */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Payment Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(amount_subtotal)}</span>
            </div>
            {total_details?.amount_tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(total_details.amount_tax)}</span>
              </div>
            )}
            {total_details?.amount_shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{formatCurrency(total_details.amount_shipping)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total:</span>
              <span>{formatCurrency(amount_total)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Status */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            payment_status === 'paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <svg className={`w-3 h-3 mr-1 ${payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
              {payment_status === 'paid' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              )}
            </svg>
            Payment Status: {payment_status === 'paid' ? 'Paid' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-600">
        Thank you for your business!
      </div>
    </div>
  )
}

export default ReceiptPurchaseComponent
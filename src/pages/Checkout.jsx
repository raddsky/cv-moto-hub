import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../App'
import { CreditCard, Smartphone, CheckCircle, Truck } from 'lucide-react'

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart, sessionId } = useCart()
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'gcash'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const totalAmount = cartTotal + (cartTotal >= 100 ? 0 : 10) + cartTotal * 0.1

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_amount: totalAmount,
          session_id: sessionId,
          items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      })

      const data = await response.json()
      setOrderId(data.order_id)
      setOrderComplete(true)
      clearCart()
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition">
          Continue Shopping
        </button>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={80} />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-600 mb-6">Order ID: <span className="font-semibold">#{orderId}</span></p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">We'll send a confirmation email to {formData.customer_email} with your order details and tracking information.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = cartTotal + (cartTotal >= 100 ? 0 : 10) + cartTotal * 0.1

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                <textarea
                  name="shipping_address"
                  required
                  value={formData.shipping_address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="123 Street, City, Philippines"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-6">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-orange-500 rounded-lg cursor-pointer bg-orange-50">
                <input
                  type="radio"
                  name="payment_method"
                  value="gcash"
                  checked={formData.payment_method === 'gcash'}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600"
                />
                <Smartphone className="text-blue-600" size={24} />
                <div>
                  <span className="font-semibold">GCash</span>
                  <p className="text-sm text-gray-500">Pay via GCash</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600"
                />
                <CreditCard className="text-gray-600" size={24} />
                <div>
                  <span className="font-semibold">Credit/Debit Card</span>
                  <p className="text-sm text-gray-500">Visa, Mastercard</p>
                </div>
              </label>
            </div>

            {formData.payment_method === 'gcash' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">GCash Payment Instructions</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open your GCash app</li>
                  <li>Send payment to: 0912-345-6789</li>
                  <li>Amount: ₱{(totalAmount * 56).toFixed(2)}</li>
                  <li>Enter your GCash reference number below</li>
                </ol>
                <input
                  type="text"
                  placeholder="GCash Reference Number"
                  className="w-full mt-3 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : `Pay ₱${(totalAmount * 56).toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{item.image}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">{cartTotal >= 100 ? 'Free' : '$10.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-orange-600">
                ${totalAmount.toFixed(2)} (₱{(totalAmount * 56).toFixed(2)})
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
            <Truck size={16} />
            <span>Estimated delivery: 5-7 business days</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

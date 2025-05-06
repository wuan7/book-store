type CartItemType = {
    price: number
    quantity: number
    selected: boolean
  }
  
  const CartSummary = ({ cart }: { cart: CartItemType[] }) => {
    const total = cart
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  
    const shipping = 30000
    const discount = 15000
    const finalTotal = total + shipping - discount
  
    return (
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between text-sm">
          <span>Tạm tính:</span>
          <span>{total.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển:</span>
          <span>{shipping.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString()}₫</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-base">
          <span>Tổng cộng:</span>
          <span>{finalTotal.toLocaleString()}₫</span>
        </div>
        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Mua hàng
        </button>
      </div>
    )
  }
  
  export default CartSummary
  
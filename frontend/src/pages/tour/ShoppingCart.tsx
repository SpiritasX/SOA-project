import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { purchase } from "../../api/purchase";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const tourIds = items.map((i) => i.id);
      const res = await purchase(tourIds);

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setSuccess("Order placed successfully! Tokens received.");
      clearCart();
      setTimeout(() => navigate("/profile"), 2000);
    } catch (e) {
      console.error(e);
      setError("An error occurred");
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                <strong>{item.name}</strong> - ${item.price}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
}

export default ShoppingCart;

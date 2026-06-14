import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { purchase } from "../../api/purchase";
import { useCart } from "../../context/CartContext";

function ShoppingCart() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setError("");
    setSuccess("");

    try {
      const tourIds = items.map((item) => item.id);
      const res = await purchase(tourIds);

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setSuccess("Order placed successfully. Tokens received.");
      clearCart();
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Checkout</p>
          <h1>Shopping Cart</h1>
          <p className="subtitle">Selected tours.</p>
        </div>
        <span className="badge badge-green">{items.length} items</span>
      </header>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <Link className="btn btn-primary" to="/">
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="split-grid">
          <section className="list-stack">
            {items.map((item) => (
              <article className="card" key={item.id}>
                <div className="card-body">
                  <div className="spaced-row">
                    <div>
                      <h2>{item.name}</h2>
                      <p className="price">${item.price}</p>
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="tool-panel cart-summary">
            <p className="eyebrow">Total</p>
            <h1>${totalPrice.toFixed(2)}</h1>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Checkout
            </button>
          </aside>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
}

export default ShoppingCart;

import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/image';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.mrp
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;

  return (
    <article className="product-card animate-fadeIn">
      <Link to={`/product/${product.id}`} className="product-card__img-wrap">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="product-card__img"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
        {discount > 0 && (
          <span className="product-card__discount">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <div className="product-card__oos">Out of Stock</div>
        )}
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__meta">
          <span className="product-card__unit">{product.unit}</span>
          {product.avg_rating > 0 && (
            <span className="product-card__rating">
              <FiStar /> {Number(product.avg_rating).toFixed(1)}
            </span>
          )}
        </div>
        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="price-current">₹{product.price}</span>
            {product.mrp && <span className="price-mrp">₹{product.mrp}</span>}
          </div>
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product.id)}
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </article>
  );
}

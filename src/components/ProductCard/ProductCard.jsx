import { Link } from 'react-router-dom';
import { FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/image';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.mrp
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;

  // Logic for categorical colors - updated: all products now use the same warm color (#fff4e6)
  const getCatColor = () => {
    return '#fff4e6'; // Warm orange/peach formerly for dates
  };

  return (
    <div className="product-card-premium animate-fadeIn">
      {/* Top Visual Section */}
      <div className="pc-top" style={{ backgroundColor: getCatColor(product.category) }}>
        <div className="pc-tag-badges">
          {product.is_featured && <span className="pc-badge">BEST SELLER</span>}
          {!product.is_featured && product.stock > 0 && <span className="pc-badge new">NEW</span>}
        </div>
        
        <Link to={`/product/${product.id}`} className="pc-img-link">
          <img
            src={getImageUrl(product.image_url || product.image)}
            alt={product.name}
            className="pc-img-vibe"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </Link>

        {/* Quick View Overlay (Visible on Hover) */}
        <button className="pc-quick-view">
          <FiEye /> Quick View
        </button>
      </div>

      {/* Bottom Content Section */}
      <div className="pc-info">
        <h3 className="pc-name">{product.name}</h3>
        <p className="pc-sub">{product.unit} • {product.category}</p>
        
        <div className="pc-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.floor(product.avg_rating || 0) ? 'star-filled' : ''} />
            ))}
          </div>
          <span className="count">({product.reviews_count || 0})</span>
        </div>

        <div className="pc-pricing">
          <span className="p-curr">₹{product.price}</span>
          {product.mrp && <span className="p-mrp">₹{product.mrp}</span>}
          {discount > 0 && <span className="p-disc">{discount}% OFF</span>}
        </div>

        <button
          className="pc-add-btn"
          onClick={() => addToCart(product.id)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

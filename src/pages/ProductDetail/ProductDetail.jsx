import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getImageUrl } from '../../utils/image';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data.data));
  }, [id]);

  if (!product) return <div className="page-center"><div className="skeleton" style={{ width: 400, height: 400 }} /></div>;

  const images = product.images?.length ? product.images : [{ image_url: '/placeholder.jpg', is_primary: 1 }];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      // refresh product
      const r = await api.get(`/products/${id}`);
      setProduct(r.data.data);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="pd-page container">
      <div className="pd-grid animate-fadeIn">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-img-wrap">
            <img src={getImageUrl(images[imgIdx]?.image_url)} alt={product.name} className="pd-main-img"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} />
            {images.length > 1 && (
              <>
                <button className="pd-arrow pd-arrow--l" onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}><FiChevronLeft /></button>
                <button className="pd-arrow pd-arrow--r" onClick={() => setImgIdx((i) => (i + 1) % images.length)}><FiChevronRight /></button>
              </>
            )}
          </div>
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <button key={img.id || i} className={`pd-thumb${i === imgIdx ? ' active' : ''}`} onClick={() => setImgIdx(i)}>
                <img src={getImageUrl(img.image_url)} alt="" onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <span className="cat-tag">{product.category}</span>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} className={`star${s <= Math.round(product.avg_rating) ? ' filled' : ''}`} />
            ))}
            <span>({product.review_count} reviews)</span>
          </div>

          <div className="pd-price">
            <span className="pd-price-current">₹{product.price}</span>
            {product.mrp && <span className="pd-price-mrp">₹{product.mrp}</span>}
            {product.mrp && <span className="pd-discount">{Math.round((1 - product.price / product.mrp) * 100)}% OFF</span>}
          </div>
          <p className="pd-unit">Pack: {product.unit}</p>
          <p className="pd-desc">{product.description}</p>

          <div className="pd-qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
          </div>

          <div className="pd-actions">
            <Button variant="primary" size="lg"
              onClick={() => addToCart(product.id, qty)}
              disabled={product.stock === 0}>
              <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
          <p className="pd-stock">{product.stock > 0 ? `${product.stock} units available` : '⚠️ Currently out of stock'}</p>
        </div>
      </div>

      {/* Reviews */}
      <section className="pd-reviews">
        <h2>Customer Reviews</h2>
        {product.reviews?.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
        <div className="reviews-list">
          {product.reviews?.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-top">
                <span className="reviewer-name">{r.reviewer}</span>
                <span className="review-rating">{'⭐'.repeat(r.rating)}</span>
                <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write a Review</h3>
            <div className="rating-pick">
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} className={`star-pick${review.rating >= s ? ' selected' : ''}`}
                  onClick={() => setReview({ ...review, rating: s })}>⭐</button>
              ))}
            </div>
            <textarea className="review-textarea" placeholder="Share your experience…"
              value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} rows={3} />
            <Button type="submit" variant="primary" loading={submitting}>Submit Review</Button>
          </form>
        )}
      </section>
    </div>
  );
}

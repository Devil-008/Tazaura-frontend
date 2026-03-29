import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import './ProductList.css';

const CATEGORIES = ['All', 'Nuts', 'Dates', 'Dry Fruits', 'Oats', 'Mixes'];
const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 – ₹400', min: 200, max: 400 },
  { label: '₹400+', min: 400, max: Infinity },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]   = useState(false);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';
  const page     = parseInt(searchParams.get('page') || '1');
  const priceIdx = parseInt(searchParams.get('price') || '0');
  const priceRange = PRICE_RANGES[priceIdx] || PRICE_RANGES[0];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: { category: category || undefined, search: search || undefined, page, per_page: 12 },
        });
        const data = res.data.data;
        // client-side price filter
        const filtered = data.products.filter(
          (p) => p.price >= priceRange.min && p.price <= priceRange.max
        );
        setProducts(filtered);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search, page, priceIdx]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="product-list-page">
      {/* Sidebar */}
      <aside className="filter-sidebar animate-slideIn">
        <h3 className="filter-title">Category</h3>
        <div className="filter-group">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${(cat === 'All' ? !category : category === cat) ? ' active' : ''}`}
              onClick={() => setParam('category', cat === 'All' ? '' : cat)}
            >{cat}</button>
          ))}
        </div>

        <h3 className="filter-title">Price</h3>
        <div className="filter-group">
          {PRICE_RANGES.map((r, i) => (
            <button
              key={r.label}
              className={`filter-chip${priceIdx === i ? ' active' : ''}`}
              onClick={() => setParam('price', i === 0 ? '' : i)}
            >{r.label}</button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="product-list-main">
        <div className="product-list-header">
          <h1 className="section-title">
            {category ? category : 'All Products'}
            <span className="product-count">{total} items</span>
          </h1>
          <input
            className="search-input"
            type="search"
            placeholder="Search products…"
            defaultValue={search}
            onChange={(e) => setParam('search', e.target.value)}
          />
        </div>

        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>😔 No products found. Try a different filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={(p) => setParam('page', p)} />
      </main>
    </div>
  );
}

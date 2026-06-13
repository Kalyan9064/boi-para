import React, { useEffect, useState } from "react";
import API from "../api/api";
import BookCard from "../components/BookCard";
import "../styles/browse.css";

function Browse() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState(""); // Submitted query
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 9,
    page: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false
  });

  const fetchBooks = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("paginate", "true");
    params.append("page", page.toString());
    params.append("limit", "9");

    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (condition) params.append("condition", condition);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);

    API.get(`/api/books?${params.toString()}`)
      .then((res) => {
        setBooks(res.data.data || []);
        setPagination(res.data.pagination || {
          total: 0,
          limit: 9,
          page: 1,
          pages: 1,
          hasNext: false,
          hasPrev: false
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading books:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category, condition, sort, q]); // Auto-refresh when these change

  const handleApplyPriceFilters = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(search);
  };

  const handleResetFilters = () => {
    setSearch("");
    setQ("");
    setCategory("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  // Helper to generate page numbers to render
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = pagination.pages || 1;
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-btn ${pagination.page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="browse-container">
      <h2 className="browse-title">Marketplace</h2>

      <div className="row">
        {/* 🔹 LEFT SIDEBAR: FILTERS */}
        <div className="col-md-3">
          <div className="filter-sidebar">
            <h5 className="mb-3" style={{ fontWeight: 700, color: "#1a202c" }}>Filters</h5>

            <hr className="filter-divider" style={{ margin: "0.5rem 0 1.2rem 0" }} />

            {/* Price Filter */}
            <form onSubmit={handleApplyPriceFilters}>
              <h6 className="filter-section-title">Price Range</h6>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="price-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span className="align-self-center text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="price-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              <button type="submit" className="apply-btn">Apply Price</button>
            </form>

            <hr className="filter-divider" />

            {/* Category Filter */}
            <h6 className="filter-section-title">Category</h6>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="category"
                className="custom-filter-input"
                checked={category === ""}
                onChange={() => { setCategory(""); setPage(1); }}
              />
              All Categories
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="category"
                className="custom-filter-input"
                checked={category === "classic"}
                onChange={() => { setCategory("classic"); setPage(1); }}
              />
              Classic
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="category"
                className="custom-filter-input"
                checked={category === "literature"}
                onChange={() => { setCategory("literature"); setPage(1); }}
              />
              Literature
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="category"
                className="custom-filter-input"
                checked={category === "academic"}
                onChange={() => { setCategory("academic"); setPage(1); }}
              />
              Academic
            </label>

            <hr className="filter-divider" />

            {/* Condition Filter */}
            <h6 className="filter-section-title">Condition</h6>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="condition"
                className="custom-filter-input"
                checked={condition === ""}
                onChange={() => { setCondition(""); setPage(1); }}
              />
              All Conditions
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="condition"
                className="custom-filter-input"
                checked={condition === "Like New"}
                onChange={() => { setCondition("Like New"); setPage(1); }}
              />
              Like New
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="condition"
                className="custom-filter-input"
                checked={condition === "Very Good"}
                onChange={() => { setCondition("Very Good"); setPage(1); }}
              />
              Very Good
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="condition"
                className="custom-filter-input"
                checked={condition === "Good"}
                onChange={() => { setCondition("Good"); setPage(1); }}
              />
              Good
            </label>
            <label className="custom-filter-label">
              <input
                type="radio"
                name="condition"
                className="custom-filter-input"
                checked={condition === "Fair"}
                onChange={() => { setCondition("Fair"); setPage(1); }}
              />
              Fair
            </label>

            <hr className="filter-divider" />

            <button onClick={handleResetFilters} className="reset-btn">Reset All Filters</button>
          </div>
        </div>

        {/* 🔹 RIGHT PANEL: SEARCH, SORT & LISTINGS */}
        <div className="col-md-9">
          {/* Action Bar */}
          <div className="action-bar">
            <form onSubmit={handleSearchSubmit} className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by title, author, category or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="sort-wrapper">
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Book Listings Grid */}
          {loading ? (
            <div className="row">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="col-md-4 mb-4">
                  <div className="skeleton-card" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="row">
                {books.map((book) => (
                  <div key={book._id} className="col-md-4 mb-4">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    &laquo;
                  </button>
                  {renderPageNumbers()}
                  <button
                    className="pagination-btn"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="empty-state">
              <span className="empty-state-icon">📚</span>
              <h4 className="empty-state-title">No Books Found</h4>
              <p className="empty-state-text">
                We couldn't find any books matching your current search or filter criteria.
              </p>
              <button onClick={handleResetFilters} className="apply-btn" style={{ width: "auto" }}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Browse;
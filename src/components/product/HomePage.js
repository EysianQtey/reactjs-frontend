import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";
import ProductDetails from "./ProductDetails";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterOption, setFilterOption] = useState("");
  const [filterLetters, setFilterLetters] = useState("");
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products?sort=${sortCriteria}&order=${sortOrder}`);
        const enhancedProducts = response.data.map((product) => ({
          ...product,
          created_at: currentDate,
        }));
        setProducts(enhancedProducts);
        setTotalProducts(enhancedProducts.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentDate, sortCriteria, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleFilterLettersChange = (event) => {
    setFilterLetters(event.target.value);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleClearSelectedProduct = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => {
      if (filterOption === "") return true;
      const name = product.title.toLowerCase();
      const letters = filterLetters.toLowerCase();
      if (filterOption === "starts_with") {
        return name.startsWith(letters);
      } else if (filterOption === "ends_with") {
        return name.endsWith(letters);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortCriteria === "title") {
        const compareResult = a.title.localeCompare(b.title);
        return sortOrder === "asc" ? compareResult : -compareResult;
      } else if (sortCriteria === "created_at") {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } 

      return 0;
    });

  return (
    <div>
      {selectedProduct ? (
        <div>
          <ProductDetails product={selectedProduct} />
          <button onClick={handleClearSelectedProduct}>Back to Gallery</button>
        </div>
      ) : (
        <div>
           <div className="welcome-message">
        <h2>Welcome to our vibrant Art Gallery</h2>
      </div>
      <h6>Immerse yourself in creativity and inspiration.   <Link to="/painting" className="link-to-painting">Paint here.</Link></h6>
          <div className="dashboard">
            <Link to="/product/list" className="add-product-link">Share Your Art</Link>
            <h5>Total Artwork Shared: {totalProducts}</h5>
          </div>
          <div className="share-message">
          <div className="line"></div> {/* Add this line */}
          </div>
          <div className="search-sort-filter">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="sort-bar">
              <label htmlFor="sort">Sort by :</label>
              <select id="sort" value={sortCriteria} onChange={handleSortChange}>
                <option value="title">Name</option>
                <option value="created_at">Date Created</option>
              </select>
              <button className="sort-order-button" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
            <div className="filter-bar">
              <label htmlFor="filter">Filter by Name :</label>
              <select id="filter" value={filterOption} onChange={handleFilterOptionChange}>
                <option value="">None</option>
                <option value="starts_with">Starts with</option>
                <option value="ends_with">Ends with</option>
              </select>
              <input
                type="text"
                id="filterLetters"
                placeholder="Enter letter"
                value={filterLetters}
                onChange={handleFilterLettersChange}
              />
            </div>
          </div>

          <div className="inventory">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item">
                <img src={`http://localhost:8000/storage/product/image/${product.image}`} alt={product.title} />
                <div>
                  <h3>{product.title}</h3>
                  <p>Description: {product.description}</p>
                  <p>Date Created: {new Date(product.created_at).toLocaleDateString()}</p>
                  <button onClick={() => handleViewDetails(product)}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

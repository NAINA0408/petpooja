import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../style/home.css";

const Home = () => {
    let [allProducts, setAllProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [idFlag, setIdFlag] = useState(true);
    let [titleFlag, setTitleFlag] = useState(true);
    let [descFlag, setDescFlag] = useState(true);
    let [catFlag, setCatFlag] = useState(true);
    let [priceFlag, setPriceFlag] = useState(true);
    let [priceFilter, setPriceFilter] = useState({
        minPrice: 0,
        maxPrice: 0
    });

    // Fetch data from API
    async function fetchData() {
        let res = await axios.get(https://fakestoreapi.com/products);
        let response = res.data;
        setAllProducts(response);
        setFilteredProducts(response);
    }

    // Function for product sort by ID
    function sortId() {
        const sorted = [...filteredProducts].sort((a, b) =>
            idFlag ? b.id - a.id : a.id - b.id
        );
        setFilteredProducts(sorted);
        setIdFlag(!idFlag);
    }

    // Function for product sort by title
    function sortTitle() {
        const sorted = [...filteredProducts].sort((a, b) =>
            titleFlag ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );
        setFilteredProducts(sorted);
        setTitleFlag(!titleFlag);
    }

    // Function for product sort by description
    function sortDesc() {
        const sorted = [...filteredProducts].sort((a, b) =>
            descFlag ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description)
        );
        setFilteredProducts(sorted);
        setDescFlag(!descFlag);
    }

    // Function for product sort by category
    function sortCat() {
        const sorted = [...filteredProducts].sort((a, b) =>
            catFlag ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
        );
        setFilteredProducts(sorted);
        setCatFlag(!catFlag);
    }

    // Function for product sort by price
    function sortPrice() {
        const sorted = [...filteredProducts].sort((a, b) =>
            priceFlag ? b.price - a.price : a.price - b.price
    );
    setFilteredProducts(sorted);
    setPriceFlag(!priceFlag);
}

// Start
// Function to handle price filter inputs
function handleInputPrice(e) {
    const { name, value } = e.target;
        setPriceFilter((prevState) => ({
            ...prevState,
            [name]: parseFloat(value) || 0,
        }));
    }
// start
    // Function to filter products by price range
    function handlePriceFilter() {
        const filtered = allProducts.filter(
            (item) => item.price >= priceFilter.minPrice && item.price <= priceFilter.maxPrice
        );
        setFilteredProducts(filtered);
    }

    // Function for Debouncing filter by search
    function debouncingfilter(e) {
        let setTimer
        clearInterval(setTimer)
        let value = e.target.value
        setTimer = setTimeout(() => {
            let filterSearch = allProducts.filter((res) => {
                return res.title.toLowerCase().includes(value.toLowerCase())
            })
            setFilteredProducts(filterSearch)
        }, 1000)
    }
    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <div className="topSearch">
                <div className="searchBox">
                    <input onInput={debouncingfilter} placeholder="Search by title" type="text" />
                </div>
                <div className="filterPrice">
                    Min Price: <input onInput={handleInputPrice} name="minPrice" type="text" placeholder="min price" />
                    Max Price: <input onInput={handleInputPrice} name="maxPrice" type="text" placeholder="max price" />
                    <button onClick={handlePriceFilter}>Search</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style={{ width: "50px" }}>ID <button onClick={sortId}>{idFlag ? '↓' : '↑'}</button></th>
                        <th>Title <button onClick={sortTitle}>{titleFlag ? '↓' : '↑'}</button></th>
                        <th>Description <button onClick={sortDesc}>{descFlag ? '↓' : '↑'}</button></th>
                        <th style={{ width: "100px" }}>Category <button onClick={sortCat}>{catFlag ? '↓' : '↑'}</button></th>
                        <th style={{ width: "70px" }}>Price <button onClick={sortPrice}>{priceFlag ? '↓' : '↑'}</button></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((ele) => (
                            <tr key={ele.id}>
                                <td>{ele.id}</td>
                                <td>{ele.title}</td>
                                <td>{ele.description}</td>
                                <td>{ele.category}</td>
                                <td>${ele.price.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Home;

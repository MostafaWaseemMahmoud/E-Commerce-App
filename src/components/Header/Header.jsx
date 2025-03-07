import React, { useEffect, useState } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ orderLength }) => {
    const [isAuth, setAuth] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setAuth(window.localStorage.getItem("id") ? true : false);
        fetch("http://localhost:3300/admindashboard/getallproducts")
            .then(response => response.json())
            .then(data => setProducts(data.message))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, products]);

    return (
        <>
        <header>
            <div className="logo" onClick={() => navigate("/")}> 
                <img src="../../../public/Lumeo (2).png" alt="logo" />
                <h1>Lumeo</h1>
            </div>
            <div className="search-div">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder='Search By Product name' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                {searchTerm && (
                    <ul className="search-results">
                        {filteredProducts.map(product => (
                            <li key={product.id} onClick={() => {navigate(`/product/${product._id}`); setSearchTerm("")}}>
                                <img src={product.image} alt="" srcset="" />
                                {product.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='btns'>
                {isAuth ? (
                    <>
                        <i className="fa-solid fa-heart fa-flip-horizontal" onClick={() => navigate("/watching-list")}></i>
                        <div className="cart">
                            <div className="cart-l"><p>{orderLength}</p></div>
                            <i className="fa-solid fa-cart-shopping" onClick={() => navigate("/cart")}></i>
                        </div>
                        <button onClick={() => { window.localStorage.removeItem("id"); window.location.reload(); }}>logOut</button>
                    </>
                ) : (
                    <button><Link to='/login' className='link'>Login</Link></button>
                )}
            </div>
            <div className="menu" onClick={()=> {
                document.querySelector(".search-div").classList.toggle('flex');
                document.querySelector(".btns").classList.toggle('flex1');
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
                        </>
    );
};

export default Header;
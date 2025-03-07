import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './products.css';
import { ToastContainer, toast } from "react-toastify";
import ArrivalProducts from '../ArrivalProducts/Arrival';

const Product = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(null);

    const getProduct = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:3300/admindashboard/getoneproduct/${id}`);
            setProduct(res.data.message);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getProduct();
    }, [id]); // Added dependency array to prevent unnecessary re-fetching

    const addwatchlist = async (productid) => {
        const userId = window.localStorage.getItem("id");
        if (!userId) {
            return toast.warn("SignIn First Please!", { theme: "light" });
        }

        try {
            const res1 = await axios.get(`http://localhost:3300/user/findone/${userId}`);

            if (res1.data.message.watchingList.includes(productid)) {
                return toast.warn("This Product is Already in Your Watching List!", { theme: "light" });
            }

            await axios.post(`http://localhost:3300/user/addwacthinglist/${userId}/${productid}`, {}, {
                headers: { authorization: "lkjfdafdsalkjfdlkjafdas" }
            });

            return toast.success("Product Added To Your Watching List!", { theme: "light" });
        } catch (error) {
            console.error("Error adding to watchlist:", error);
        }
    };

    const addOrder = async(productId)=> {
        const id = window.localStorage.getItem("id");
        if(!id){
            return toast.warn("SignIn First Please!", { theme: "light" });
        }

        try {
            const allOrdersData = await axios.post(`http://localhost:3300/manageorder/allorders`);
            const allOrders = allOrdersData.data.message;
    
            for (let i = 0; i < allOrders.length; i++) {
                const order = allOrders[i];
                if(order.item.productId == productId){
                    return toast.warn(`This Order Is Already Exist In Your Cart`, { theme: "light" });
                }
            }
            const res = await axios.post(`http://localhost:3300/manageorder/addorder`,{
                userId: id,
                itemId: productId 
            })
            setOrderLength(prev => prev + 1);   
            return toast.success(`${res.data.message}`, { theme: "light" });
        } catch (error) {
            console.log("Error While Adding An Order" , error);
            return toast.error(`Error While Adding An Order`, { theme: "light" });
        }
    }

    return (
        <div className="product-container">
            <ToastContainer />
            {isLoading ? (
                <div className="loading-div">
                    <div className="loading">Loading...</div>
                </div>
            ) : product ? (
                <div className="product-details">
                    <div className="img">
                        <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-txt">
                        <p className="category">{product.category}</p>
                        <h1>{product.name}</h1>
                        <p className="price">${product.price}</p>
                        <h3 className="stock">Stock: {product.stock}</h3>
                        <div className="buttons">
                            <button className='buyBtn' onClick={()=>{addOrder(product._id)}}>
                                Buy Now <i className="fa-solid fa-wallet"></i>
                            </button>
                            <button className='watchBtn' onClick={() => addwatchlist(product._id)}>
                                Add to WatchList <i className="fa-solid fa-bag-shopping" style={{ cursor: "pointer" }}></i>
                            </button>
                        </div>
                        <p className="description">{product.description}</p>
                    </div>
                </div>
            ) : (
                <p className="error-message">Product not found!</p>
            )}
            <ArrivalProducts></ArrivalProducts>
        </div>
    );
};

export default Product;

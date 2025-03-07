import axios from 'axios';
import './cart.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productSalary, SetProductSalary] = useState(0);
    const navigate = useNavigate();
    const stripePromise = loadStripe("pk_test_51QyedLRoRxdn0cqV7wOh5tco7HH32S4Datyp66Sui8nzZPOsHiwzSQGvMYyQAbeTUse6RKmxFBTULcEAd6VOV2kw00Qg1aT9D7");

    const getAllOrders = async () => {
        try {
            const Allorders = await axios.post("https://e-commerce-backend-app.up.railway.app/manageorder/allorders");
            const userOrders = Allorders.data.message.filter(order => order.userId === window.localStorage.getItem("id"));

            const productRequests = userOrders.map(order =>
                axios.get(`https://e-commerce-backend-app.up.railway.app/admindashboard/getoneproduct/${order.item.productId}`)
            );

            const productResponses = await Promise.all(productRequests);
            const AllProducts = productResponses.map(res => res.data.message);

            let Counter = 0;
            AllProducts.forEach(product => {
                Counter += product.price;
            });

            setProducts(AllProducts);
            SetProductSalary(Counter);
        } catch (error) {
            console.log("Error While Getting All Orders:", error);
            setProducts([]);
            toast.error("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            if (products.length === 0) {
                toast.error("No products in the cart.");
                return;
            }

            const response = await axios.post("https://e-commerce-backend-app.up.railway.app/payment/create-payment-intent", {
                price: productSalary,  // Ensure this is a valid number in dollars
                quantity: products.length,  // Ensure this is a number
                products: products  // Sending product details to the backend
            });

            const { url } = response.data;
            window.location.href = url; // Redirect to Stripe Checkout session
        } catch (error) {
            console.error("Error creating payment session:", error);
            toast.error("Error creating payment session.");
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="cart-section">
                <h1 className="section-heading">Your Cart</h1>
                <div className="content">
                    <div className="orders">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="product">
                                    <div className="img">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-desc">
                                        <h1>{product.name}</h1>
                                        <p className="category">{product.category}</p>
                                        <p className="price">${product.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>
                    <div className="order-summary">
                        <h1 className="section-heading">Order Summary</h1>
                        <hr />
                        <div className="item">
                            <p className="Items-length">Total Quantity</p>
                            <p className='value'>{products.length}</p>
                        </div>
                        <div className="item">
                            <p className="Items-length">Total Price</p>
                            <p className='value'>${productSalary}</p>
                        </div>
                        <div className="btns" style={{display:"flex",alignContent:"center",justifyContent:"center"}}>
                            <button onClick={handleCheckout} className="watchBtn" style={{ cursor: "pointer",display:"flex" }} disabled={isLoading || products.length === 0}>
                                <span style={{ fontFamily: "sans-serif" }}>Payment</span> <i className="fa-solid fa-wallet"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;

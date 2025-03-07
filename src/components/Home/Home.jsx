import React, { useEffect, useState } from 'react';
import './home.css';
import Scene from '../3dmodel/Scene';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ArrivalProducts from '../ArrivalProducts/Arrival';

const Home = ({ setOrderLength }) => {
    const BaseApi = "https://e-commerce-backend-app.up.railway.app";
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const UserId = window.localStorage.getItem("id");
    
    const updateOrderLength = async () => {
        try {
            const response = await axios.post("https://e-commerce-backend-app.up.railway.app/manageorder/allorders");
            const allOrders = response.data.message;
            let count = allOrders.filter(order => order.userId === UserId).length;
            setOrderLength(count);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        updateOrderLength();
        const interval = setInterval(updateOrderLength, 3000);
        return () => clearInterval(interval);
    }, []);

    const getAllProducts = async () => {
        try {
            const res = await axios.get(BaseApi+"/admindashboard/getallproducts", {
                headers: { authorization: "lkjfdafdsalkjfdalkfdlkjafdas" }
            });

            if (res.data?.message) {
                setAllProducts(res.data.message);
                extractCategories(res.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const extractCategories = (products) => {
        const uniqueCategories = new Set(products.map(product => product.category));
        setAllCategories([...uniqueCategories]);
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    const addwatchlist = async(productid) => {
        if(!window.localStorage.getItem("id")){
            return toast.warn("SignIn First Please!", { theme: "light" });
        }
        
        const res1 = await axios.get(BaseApi+`/user/findone/${window.localStorage.getItem("id")}`);

        for (let i = 0; i < res1.data.message.watchingList.length; i++) {
            if(res1.data.message.watchingList[i] === productid){
                return toast.warn("This Product Already In Watching List!", { theme: "light" });
            }
        }

        try {
            await axios.post(BaseApi+`/user/addwacthinglist/${window.localStorage.getItem('id')}/${productid}`);
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
            const allOrdersData = await axios.post(`${BaseApi}/manageorder/allorders`);
            const allOrders = allOrdersData.data.message;
    
            for (let i = 0; i < allOrders.length; i++) {
                const order = allOrders[i];
                if(order.item.productId == productId){
                    return toast.warn(`This Order Is Already Exist In Your Cart`, { theme: "light" });
                }
            }
            const res = await axios.post(`${BaseApi}/manageorder/addorder`,{
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
        <div className="home">
            <ToastContainer />
            <div className="3dmodel" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Scene />
            </div>
            <div className="heading">
                <h1>Main Section</h1>
            </div>

            <div className="categories">
                {allCategories.map((category, index) => (
                    <div key={index} className="category-item">
                        <div className="cate-img">
                            <img
                                src={
                                    category === "Mobiles"
                                        ? "/Opera Snapshot_2025-02-26_210440_res.cloudinary.com.png"
                                        : category === "Airpods"
                                        ? "/airpods phone.png"
                                        : category === "Camera"
                                        ? "/camera.png"
                                        : "/Lumeo.png"
                                }
                                alt={category}
                            />
                        </div>
                        <h1>{category}</h1>
                    </div>
                ))}
            </div>

            <ArrivalProducts />
            {['Mobiles', 'Airpods', 'Camera'].map((category) => (
                <div key={category} className="mobiles-div">
                    <h2 className="sectionHeading">{category}</h2>
                    <div className="products-slider">
                    <Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={10}
    slidesPerView="auto"
    centeredSlides={true}
    loop={true}
    navigation
    pagination={{ clickable: true }}
    breakpoints={{
        480: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
    }}
    className="my-6"
>

                            {allProducts.filter((product) => product.category === category).map((product) => (
                                <SwiperSlide key={product._id} className="p-4 border rounded-lg">
                                    <div className="product">
                                        <div className="img" onClick={() => navigate(`/product/${product._id}`)}>
                                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                                        </div>
                                        <div className="desc-txt">
                                            <h3 onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                                            <p className="category">{product.category}</p>
                                            <p className="price">${product.price}</p>
                                            <div className="btns">
                                                <i onClick={() => addwatchlist(product._id)} className="fa-solid fa-heart fa-flip-horizontal" style={{ cursor: "pointer" }}></i>
                                                <i className="fa-solid fa-bag-shopping" onClick={() => addOrder(product._id)} style={{ cursor: "pointer" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;

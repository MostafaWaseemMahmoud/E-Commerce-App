import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ArrProduct = () => {
    const navigate = useNavigate();
    const [ArrivalMobile, SetArrivalMobile] = useState(null);
    const [ArrivalAirPods, SetArrivalAirPods] = useState(null);
    const [ArrivalCam, SetArrivalCam] = useState(null);
    const [Loading, SetLoading] = useState(true);

    const ArrivalProducts = [
        { id: 1, src: "/phone_3.3b5338d6a3289590edb7.avif" },
        { id: 2, src: "/tv_1.f5919da0f2303c3b7314.avif" },
        { id: 3, src: "/tv_2.30452936fe502d7c52b2.avif" },
        { id: 4, src: "/camera_1.79e54eb920bb7787abec.avif" },
        { id: 5, src: "/phone_9.6f64aab7896f447a2ab2.avif" },
        { id: 6, src: "/phone_8.b3123f8e7bddecf9b0d7.avif" }
    ];

    const addwatchlist = async(productid) => {
        if(!window.localStorage.getItem("id")){
            return toast.warn("SignIn First Please!", { theme: "light" });
        }

        const res1 = await axios.get(`https://e-commerce-backend-g3yp.vercel.app/user/findone/67c08e3958df0fa5d0f3dfce`);

        for (let i = 0; i < res1.data.message.watchingList.length; i++) {
            if(res1.data.message.watchingList[i] === productid){
                return toast.warn("This Product Already In Watching List!", { theme: "light" });
            }
        }

        try {
            await axios.post(`https://e-commerce-backend-g3yp.vercel.app/user/addwacthinglist/${window.localStorage.getItem('id')}/${productid}`);
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
            const allOrdersData = await axios.post(`https://e-commerce-backend-g3yp.vercel.app/manageorder/allorders`);
            const allOrders = allOrdersData.data.message;

            for (let i = 0; i < allOrders.length; i++) {
                const order = allOrders[i];
                if(order.item.productId == productId){
                    return toast.warn(`This Order Is Already Exist In Your Cart`, { theme: "light" });
                }
            }
            const res = await axios.post(`https://e-commerce-backend-g3yp.vercel.app/manageorder/addorder`,{
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

    const ReadAllData = async () => {
        SetLoading(true);
        try {
            const response = await axios.get("https://e-commerce-backend-g3yp.vercel.app/admindashboard/getallproducts", {
                headers: { authorization: "lkjfdafdsalkjfdalkfdlkjafdas" }
            });

            const allProducts = response.data.message;
            SetArrivalMobile(allProducts.find(e => e.category === "Mobiles") || null);
            SetArrivalAirPods(allProducts.find(e => e.category === "Airpods") || null);
            SetArrivalCam(allProducts.find(e => e.category === "Camera") || null);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            SetLoading(false);
        }
    };

    useEffect(() => {
        ReadAllData();
    }, []);

    return (
        <div className='arrival-products' style={{ marginTop: "50px", marginBottom: "50px" }}>
            <ToastContainer></ToastContainer>
            <h1 className="sectionHeading" style={{ textAlign: "center" }}>Arrival Products</h1>

            {Loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : (
                <>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={3}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{ delay: 2000, disableOnInteraction: false }}
                        className="my-6"
                    >
                        {ArrivalProducts.map((product) => (
                            <SwiperSlide key={product.id} className="swiper-slide-custom" onClick={() => navigate("/arrival-products")}>
                                <img src={product.src} alt="Arrival Product" className="product-image" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="products" style={{ display: "flex", justifyContent: "center", marginTop: "100px", gap: "90px" }}>
                        {[ArrivalMobile, ArrivalAirPods, ArrivalCam].map((product, index) => (
                            product && (
                                <div key={index} className="product">
                                    <div className="img" onClick={() => navigate(`/product/${product._id}`)}>
                                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                                    </div>
                                    <div className="desc-txt" onClick={() => navigate(`/product/${product._id}`)}>
                                        <h3>{product.name}</h3>
                                        <p className="category">{product.category}</p>
                                        <p className="price">${product.price}</p>
                                    </div>
                                    <div className="btns">
                                        <i className="fa-solid fa-heart fa-flip-horizontal" onClick={()=>{addwatchlist(product._id)}} style={{ cursor: "pointer" }}></i>
                                        <i className="fa-solid fa-bag-shopping" onClick={()=>addOrder(product._id)} style={{ cursor: "pointer" }}></i>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ArrProduct;

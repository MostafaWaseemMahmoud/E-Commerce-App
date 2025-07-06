import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./watch.css";

const WatchingList = () => {
    const [watchingList, setWatchingList] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const getAllProducts = async (productIds) => {
        try {
            const productRequests = productIds.map((productId) =>
                axios.get(`https://e-commerce-backend-g3yp.vercel.app/admindashboard/getoneproduct/${productId}`)
            );

            const responses = await Promise.all(productRequests);
            setProducts(responses.map(res => res.data.message));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const GET_USER_WATCHING_LIST = async () => {
        setIsLoading(true);

        const userId = localStorage.getItem("id"); // Get user ID from localStorage
        if (!userId) {
            console.warn("User not logged in");
            setIsLoading(false);
            return;
        }

        try {
            const res1 = await axios.get(`https://e-commerce-backend-g3yp.vercel.app/user/findone/${userId}`);

            const userWatchingList = res1.data.message.watchingList || [];
            setWatchingList(userWatchingList);

            if (userWatchingList.length > 0) {
                await getAllProducts(userWatchingList);
            }
        } catch (error) {
            console.error("Error fetching watching list:", error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        GET_USER_WATCHING_LIST();
    }, []);

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

    return (
        <div className='watching-list' style={{margin:"50px"}}>
            <ToastContainer></ToastContainer>
            {isLoading ? (
                <div className="loading-div">
                    <div className="loading">Loading... Watching List</div>
                </div>
            ) : products.length > 0 ? (
                                    <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={2}
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
                    {products.map((product) => (
                        <SwiperSlide key={product._id} className="p-4 border rounded-lg">
                            <div className="product">
                                <div className="img" onClick={() => navigate(`/product/${product._id}`)}>
                                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                                </div>
                                <div className="desc-txt">
                                    <h3 onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="price">${product.price}</p>
                                    <div className="btns" onClick={()=>addOrder(product._id)}>
                                        <i
                                            style={{ cursor: "pointer" }}
                                            className="fa-solid fa-bag-shopping"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No products in your watching list.</p>
            )}
        </div>
    );
};

export default WatchingList;

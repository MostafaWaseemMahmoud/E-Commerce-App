import React from 'react';
import './arrival.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom';

const ArrivalProducts = () => {
    const navigate = useNavigate();

    const ArrivalProducts = [
        { id: 1, src: "/phone_3.3b5338d6a3289590edb7.avif" },
        { id: 2, src: "/tv_1.f5919da0f2303c3b7314.avif" },
        { id: 3, src: "/tv_2.30452936fe502d7c52b2.avif" },
        { id: 4, src: "/camera_1.79e54eb920bb7787abec.avif" },
        { id: 5, src: "/phone_9.6f64aab7896f447a2ab2.avif" },
        { id: 6, src: "/phone_8.b3123f8e7bddecf9b0d7.avif" }
    ];

    return (
        <div className='arrival-products' style={{ marginTop: "50px", marginBottom: "50px" }}>
            <h1 className="sectionHeading" style={{ textAlign: "center" }}>
                Arrival Products
            </h1>

            <div className="content">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={3} 
                    centeredSlides={true} 
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    className="my-6"
                >
                    {ArrivalProducts.map((product) => (
                        <SwiperSlide 
                            key={product.id} 
                            className="swiper-slide-custom" 
                            onClick={() => navigate("/arrival-products")} // ✅ Fix applied
                        >
                            <img src={product.src} alt="Arrival Product" className="product-image" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ArrivalProducts;

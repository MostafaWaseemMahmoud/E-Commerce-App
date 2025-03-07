import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
    const Navigate = useNavigate(); 
    const otpInput = useRef();
    const [otp, setOtp] = useState("");
    const email = window.localStorage.getItem("email")
    const name = window.localStorage.getItem("name")
    const password = window.localStorage.getItem("password")

    useEffect(() => {
        const userEmail = window.localStorage.getItem("email")
        // Send OTP via backend API
        axios.post("https://e-commerce-backend-app.up.railway.app/send-otp", { email: userEmail })
            .then(response => {
            setOtp(response.data.otp);
            window.localStorage.setItem('otp',response.data.otp)
            toast.success("OTP sent to your email!", { theme: "dark" });
        })
    .catch(() => toast.error("Error sending OTP!", { theme: "dark" }));
    }, []);

    const handleVerify = () => {
        const enteredOtp = otpInput.current.value;
        const storedOtp = localStorage.getItem("otp");

        if (enteredOtp === storedOtp) {
            try {
            axios.post("https://e-commerce-backend-app.up.railway.app/user/add", { name, email, password }).then((res)=> {
                console.log(res);
                window.localStorage.setItem("id" , res.data._id);
                window.localStorage.removeItem('otp')
            })
            toast.success("User registered successfully!", { theme: "dark" });
            window.location.reload();
              Navigate("/")
            } catch (error) {
              toast.error("Error while adding a user!", { theme: "dark" });
            }
            toast.success("OTP Verified Successfully!", { theme: "dark" });

        } else {
            toast.error("Incorrect OTP!", { theme: "dark" });
        }
    };

    return (
        <div className='login'>
            <ToastContainer />
            <div className="login-form">
                <h1 className='heading'>Enter OTP sent to {localStorage.getItem("email")}</h1>
                <div className="field">
                    <span>OTP</span>
                    <div className="input">
                        <i className="fa-solid fa-user"></i>
                        <input type="text" ref={otpInput} placeholder='Enter Your OTP' />
                        <hr className="bg-gred" />
                    </div>
                </div>
                <button onClick={handleVerify}>Verify</button>
            </div>
        </div>
    );
};

export default Verify;

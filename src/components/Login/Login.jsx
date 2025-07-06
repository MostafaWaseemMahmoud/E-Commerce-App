import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './login.css';
const Login = () => {
    const Navigate = useNavigate();
    const [reqData,setReqData] = useState(null);
    useEffect(()=>{
        axios.get("https://e-commerce-backend-g3yp.vercel.app/user/all", {
            headers: {
                'Authorization': 'lkjfdafdsalkjfdalkfdlkjafdas',
            }
        }).then((res)=> {
            setReqData(res.data.message)
        })

        if(window.localStorage.getItem("id")){
            Navigate("/")
        }
    },[])
    const inputPassword = useRef();
    const inputEmail = useRef();
    const submit = ()=> {
            console.log(reqData);
            let userFound = false;
            if(inputEmail.current.value == "" || !inputEmail.current.value.match(/\w+(\d+)?@gmail.com/) || inputPassword.current.value == ""){
                toast.warn("Please Inter A Valid Data!", {
                    position: "top-right",
                    autoClose: 3000, // Closes in 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }

            for (let i = 0; i < reqData.length; i++) {
                const user = reqData[i];

                if (user.email === inputEmail.current.value) {
                    userFound = true;

                    if (user.password === inputPassword.current.value) {
                        console.log("Login successful:", user);
                        toast.success("Login Successful!", {
                            position: "top-right",
                            autoClose: 3000, // Closes in 3 seconds
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });

                        window.localStorage.setItem("id" , user._id)
                        Navigate("/")
                        // Redirect or update UI as needed
                    } else {
                        toast.error("Password Is Incorrect", {
                            position: "top-right",
                            autoClose: 3000, // Closes in 3 seconds
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                    break; // Stop looping once the user is found
                }
            }

            if (!userFound) {
                toast.error("Email Not Found", {
                    position: "top-right",
                    autoClose: 3000, // Closes in 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
    }


  return (
    <div className='login'>
                    <ToastContainer />
      <div  className="login-form">
        <h1 className='heading'>Login</h1>
        <div className="field">
        <span>Email</span>
        <div className="input">
            <div className="--1">
        <i class="fa-solid fa-user"></i>
        <input type="email" ref={inputEmail}placeholder='Enter Your Email'/>
            </div>
        <hr class="bg-gred" />
        </div>
        </div>
        <div className="field">
        <span>Password</span>
        <div className="input">
            <div className="--1">
        <i class="fa-solid fa-lock"></i>
        <input ref={inputPassword}type="password" placeholder='Enter Your Password'/>
        </div>
        <hr class="bg-gred" />
        </div>
        </div>
        <button onClick={submit}>Login</button>
      <div className="some-txt">
        <p>Haven't Account Yet?</p>
        <p><Link className='link1' to="/signup">Sign Up</Link></p>
      </div>
      </div>
    </div>

  );
};

export default Login;
import React, { useEffect } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUserLogin } from '../../Slices/User';
import { clearCart, updateCart } from '../../Slices/Cart';
import APIService from '../../utils/ApiService';
const Navbar = () => {
    const totalCartItems = useSelector(state => state.cart.totalItems);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            
            const userResp = await APIService.GET('/auth/me');
            const {data:cartResp} = await APIService.GET('/cart');
          
            if(cartResp.cart)
                dispatch(updateCart(cartResp.cart))
            else 
                dispatch(updateCart({
                    totalItems: 0,
                    cartItems: [],
                    lastUpdated:null
                }))
            dispatch(setUserLogin(userResp.data.user))
        })();
    }, [])
   
    return <div className='flex justify-between px-5 py-4 bg-white w-full items-center '>
        <Link to={'/'} className='text-2xl flex gap-4 items-center'>
            <svg viewBox="0 0 512 512" className='w-10 h-10'>
                <g>
                    <path d="M143.5 326.255a7.5 7.5 0 0 0-7.5 7.5v13.5a7.5 7.5 0 0 0 15 0v-13.5a7.5 7.5 0 0 0-7.5-7.5z" className opacity={1}>
                    </path>
                    <path d="M488.312 425.849h-12.143V217.76c20.115-3.56 35.445-21.155 35.445-42.276v-28.876c0-.147-.014-.291-.022-.436-.005-.081-.005-.162-.012-.243a7.517 7.517 0 0 0-.128-.871c-.003-.017-.009-.033-.013-.049a7.389 7.389 0 0 0-.224-.8c-.022-.066-.048-.132-.072-.197a7.436 7.436 0 0 0-.278-.655c-.019-.039-.031-.08-.05-.118L477.653 77.29V42.796c0-8.902-7.243-16.145-16.145-16.145H120.456a7.5 7.5 0 0 0 0 15h341.052c.631 0 1.145.514 1.145 1.145V71.64H49.347V42.796c0-.631.514-1.145 1.145-1.145H85.56a7.5 7.5 0 0 0 0-15H50.492c-8.902 0-16.145 7.243-16.145 16.145V77.29L1.186 143.239c-.019.039-.032.08-.05.118a7.436 7.436 0 0 0-.278.655c-.024.066-.05.131-.072.197a7.389 7.389 0 0 0-.224.8l-.013.049c-.06.285-.102.575-.128.871-.007.081-.007.162-.012.243-.008.145-.022.289-.022.436v28.876c0 21.12 15.33 38.716 35.445 42.276v208.089H23.688C10.626 425.849 0 436.476 0 449.538v23.722c0 6.666 5.423 12.089 12.089 12.089h487.822c6.666 0 12.089-5.423 12.089-12.089v-23.722c0-13.062-10.626-23.689-23.688-23.689zm8.301-250.364c0 15.409-12.536 27.945-27.945 27.945s-27.945-12.536-27.945-27.945v-21.376h55.89v21.376zM465.565 86.64l26.382 52.468h-53.448L419.655 86.64h45.91zm-61.849 0 18.844 52.468h-54.17L357.083 86.64h46.633zm22.008 67.468v21.376c0 15.409-12.536 27.945-27.945 27.945s-27.945-12.536-27.945-27.945v-21.376h55.89zM341.739 86.64l11.307 52.468h-54.62l-3.769-52.468h47.082zm13.095 67.468v21.376c0 15.409-12.536 27.945-27.944 27.945s-27.945-12.536-27.945-27.945v-21.376h55.889zM232.382 86.64h47.235l3.769 52.468h-54.773l3.769-52.468zm-4.327 67.468h55.89v21.376c0 15.409-12.536 27.945-27.945 27.945s-27.945-12.536-27.945-27.945v-21.376zM256 218.429c14.704 0 27.701-7.431 35.445-18.732 7.744 11.301 20.741 18.732 35.445 18.732s27.701-7.431 35.444-18.732c7.744 11.301 20.741 18.732 35.445 18.732s27.701-7.431 35.445-18.732c6.396 9.334 16.379 16.016 27.945 18.063v208.089H178.836V259.185c0-7.692-6.258-13.95-13.95-13.95H78.177c-7.692 0-13.95 6.258-13.95 13.95v166.664H50.832V217.76c11.566-2.047 21.549-8.729 27.945-18.063 7.744 11.301 20.741 18.732 35.445 18.732s27.701-7.431 35.445-18.732c7.744 11.301 20.741 18.732 35.444 18.732s27.701-7.431 35.445-18.732c7.743 11.301 20.74 18.732 35.444 18.732zm-92.164 41.806v165.614H79.227V260.235h84.609zm-77.56-84.75v-21.376h55.89v21.376c0 15.409-12.536 27.945-27.945 27.945s-27.945-12.537-27.945-27.945zm83.985-88.845h47.082l-3.769 52.468h-54.62l11.307-52.468zm-13.095 67.468h55.889v21.376c0 15.409-12.536 27.945-27.945 27.945s-27.944-12.536-27.944-27.945v-21.376zm-2.25-67.468-11.307 52.468h-54.17l18.844-52.468h46.633zm-108.481 0h45.91l-18.844 52.468H20.053L46.435 86.64zm-31.048 88.845v-21.376h55.89v21.376c0 15.409-12.536 27.945-27.945 27.945s-27.945-12.537-27.945-27.945zM15 470.349v-20.812c0-4.791 3.897-8.688 8.688-8.688h464.623c4.791 0 8.688 3.897 8.688 8.688v20.812H15z" className opacity={1}>
                    </path>
                    <path d="M426.773 245.235H335.06a7.5 7.5 0 0 0 0 15h90.664V378.27H209.5V260.235h90.25a7.5 7.5 0 0 0 0-15h-91.3c-7.692 0-13.95 6.257-13.95 13.95v120.136c0 7.692 6.258 13.95 13.95 13.95h218.323c7.692 0 13.95-6.258 13.95-13.95V259.185c0-7.692-6.258-13.95-13.95-13.95z" className opacity={1}>
                    </path>
                </g>
            </svg>
            <span>SmartShop</span>
            
        </Link>

        <div className="flex gap-5 items-center">
            {user.name ? <p className='dropdown-container z-100 text-sm p-5 cursor-pointer hover:bg-slate-200 relative'>
                Hi {user.name}
                <div className="dropdown absolute z-50  h-max w-full top-[100%] right-0 bg-white">
                    <div className="dropdown-content flex flex-col z-40">
                        {/* <Link className='p-2 gap-2 items-center  flex h-full hover:bg-slate-300' to="/profile">
                            <svg className='w-5 h-5 ' viewBox="0 0 682.667 682.667" style={{ enableBackground: 'new 0 0 512 512' }} >
                                <g>
                                    <defs>
                                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                            <path d="M0 512h512V0H0Z" fill="#000000" data-original="#000000" />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                        <path d="M0 0c-44.11 0-80 35.89-80 80s35.89 80 80 80 80-35.89 80-80S44.11 0 0 0Z" style={{ strokeWidth: 20, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(256 236)" fill="none" stroke="#000000" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeDasharray="none" strokeOpacity data-original="#000000" />
                                        <path d="M0 0c.01.13.02.26.04.39 7.25 76.08 71.329 135.58 149.31 135.58 77.98 0 142.049-59.49 149.32-135.57" style={{ strokeWidth: 20, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(106.65 60.03)" fill="none" stroke="#000000" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeDasharray="none" strokeOpacity data-original="#000000" />
                                        <path d="M0 0c0-5.523-4.478-10-10-10S-20-5.523-20 0s4.478 10 10 10S0 5.523 0 0" style={{ fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }} transform="translate(450 420)" fill="#000000" data-original="#000000" />
                                        <path d="M0 0c22.581-37.189 35.579-80.857 35.579-127.592 0-79.79-37.89-150.65-96.68-195.57v-.01c-41.39-31.64-93.14-50.42-149.32-50.42-56.17 0-107.92 18.78-149.309 50.42-58.791 44.92-96.691 115.78-96.691 195.58 0 135.96 110.02 246 246 246 56.871 0 109.207-19.25 150.851-51.598" style={{ strokeWidth: 20, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(466.42 383.592)" fill="none" stroke="#000000" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeDasharray="none" strokeOpacity data-original="#000000" />
                                    </g>
                                </g>
                            </svg>
                            <span>Profile</span>
                        </Link> */}
                        <Link className='p-2 gap-2 items-center  flex hover:bg-slate-300' to="/orders">
                            <svg viewBox="0 0 1550 1550">
                                <g>
                                    <path d="M726.8 1517.2c-4 0-7.9-1.1-11.4-3.3-6-3.9-9.6-10.5-9.6-17.7V688.7c0-8.2 4.8-15.7 12.3-19.1l695.8-317.4c6.5-3 14.1-2.4 20.1 1.4 6 3.9 9.6 10.5 9.6 17.7v382.6c0 11.6-9.4 21-21 21s-21-9.4-21-21v-350L747.8 702.2v761.3l189.1-86.3c10.6-4.8 23-.2 27.8 10.4s.2 23-10.4 27.8l-218.8 99.8c-2.8 1.3-5.8 2-8.7 2zM281.3 1208.5c-3 0-5.9-.6-8.7-1.9L112 1133.4c-7.5-3.4-12.3-10.9-12.3-19.1V967.9c0-7.1 3.6-13.8 9.6-17.7s13.6-4.4 20.1-1.4l160.6 73.3c7.5 3.4 12.3 10.9 12.3 19.1v146.4c0 7.1-3.6 13.8-9.6 17.7-3.5 2.1-7.5 3.2-11.4 3.2zm-139.6-107.7 118.6 54.1v-100.2l-118.6-54.1z" fill="#000000" data-original="#000000" className />
                                    <path d="M726.8 1517.2c-3 0-5.9-.6-8.7-1.9L22.3 1197.9c-7.5-3.4-12.3-10.9-12.3-19.1V371.2c0-7.1 3.6-13.8 9.6-17.7s13.6-4.4 20.1-1.4l695.8 317.4c7.5 3.4 12.3 10.9 12.3 19.1v807.5c0 7.1-3.6 13.8-9.6 17.7-3.5 2.3-7.5 3.4-11.4 3.4zM52 1165.3l653.8 298.3V702.2L52 403.9z" fill="#000000" data-original="#000000" className />
                                    <path d="M438.8 764.2c-2.9 0-5.9-.6-8.7-1.9L276 692c-10.6-4.8-15.2-17.3-10.4-27.8 4.8-10.6 17.3-15.2 27.8-10.4l154.1 70.3c10.6 4.8 15.2 17.3 10.4 27.8-3.5 7.7-11.1 12.3-19.1 12.3zM1422.5 392.2c-2.9 0-5.9-.6-8.7-1.9l-687-313.4L39.7 390.3c-10.6 4.8-23 .2-27.8-10.4s-.2-23 10.4-27.8L718.1 34.7c5.5-2.5 11.9-2.5 17.4 0l695.8 317.4c10.6 4.8 15.2 17.3 10.4 27.8-3.6 7.8-11.2 12.3-19.2 12.3z" fill="#000000" data-original="#000000" className />
                                    <path d="M284.7 508c-8 0-15.6-4.6-19.1-12.3-4.8-10.6-.2-23 10.4-27.8l695.8-317.4c10.6-4.8 23-.2 27.8 10.4s.2 23-10.4 27.8L293.4 506.1c-2.8 1.3-5.8 1.9-8.7 1.9zM438.8 578.3c-11.6 0-21-9.4-21-21 0-8.7 5.3-16.2 12.8-19.4l695.2-317.2c10.6-4.8 23-.2 27.8 10.4s.2 23-10.4 27.8L447.5 576.4c-2.7 1.2-5.7 1.9-8.7 1.9z" fill="#000000" data-original="#000000" className />
                                    <path d="M438.8 764.2c-11.6 0-21-9.4-21-21V557.3c0-11.6 9.4-21 21-21s21 9.4 21 21v185.9c0 11.6-9.4 21-21 21zM284.7 693.9c-11.6 0-21-9.4-21-21V487c0-11.6 9.4-21 21-21s21 9.4 21 21v185.9c0 11.6-9.4 21-21 21zM1485.1 1455.8H979.5c-30.3 0-54.9-24.6-54.9-54.9V787.7c0-30.3 24.6-54.9 54.9-54.9h117c11.6 0 21 9.4 21 21s-9.4 21-21 21h-117c-7.1 0-12.9 5.8-12.9 12.9v613.2c0 7.1 5.8 12.9 12.9 12.9h505.6c7.1 0 12.9-5.8 12.9-12.9V787.7c0-7.1-5.8-12.9-12.9-12.9h-117c-11.6 0-21-9.4-21-21s9.4-21 21-21h117c30.3 0 54.9 24.6 54.9 54.9v613.2c0 30.3-24.6 54.9-54.9 54.9z" fill="#000000" data-original="#000000" className />
                                    <path d="M1297.7 734.6c-11.6 0-21-9.4-21-21v-36.3c0-.9-.7-1.6-1.6-1.6h-85.6c-.9 0-1.6.7-1.6 1.6v36.3c0 11.6-9.4 21-21 21s-21-9.4-21-21v-36.3c0-24 19.6-43.6 43.6-43.6h85.6c24 0 43.6 19.6 43.6 43.6v36.3c0 11.6-9.4 21-21 21z" fill="#000000" data-original="#000000" className />
                                    <path d="M1328.1 829.4h-191.6c-33.6 0-61-27.4-61-61v-14.9c0-33.6 27.4-61 61-61h191.6c33.6 0 61 27.4 61 61v14.9c0 33.6-27.4 61-61 61zm-191.6-94.8c-10.5 0-19 8.5-19 19v14.9c0 10.5 8.5 19 19 19h191.6c10.5 0 19-8.5 19-19v-14.9c0-10.5-8.5-19-19-19zM1412.8 1000.8H1169c-11.6 0-21-9.4-21-21s9.4-21 21-21h243.8c11.6 0 21 9.4 21 21s-9.4 21-21 21zM1412.8 1115.3H1169c-11.6 0-21-9.4-21-21s9.4-21 21-21h243.8c11.6 0 21 9.4 21 21s-9.4 21-21 21zM1412.8 1229.8H1169c-11.6 0-21-9.4-21-21s9.4-21 21-21h243.8c11.6 0 21 9.4 21 21s-9.4 21-21 21z" fill="#000000" data-original="#000000" className />
                                    <circle cx="1076.9" cy="979.8" r="25.2" fill="#000000" data-original="#000000" className />
                                    <circle cx="1076.9" cy="1094.3" r="25.2" fill="#000000" data-original="#000000" className />
                                    <circle cx="1076.9" cy="1208.8" r="25.2" fill="#000000" data-original="#000000" className />
                                </g>
                            </svg>
                            <span>Orders</span>

                        </Link>
                        <p className='p-2 gap-2 items-center  flex hover:bg-slate-300' onClick={() => {
                            localStorage.removeItem('token');
                            dispatch(clearUser());
                            dispatch(clearCart());
                        }}>
                            <svg viewBox="0 0 30 30">
                                <g>
                                    <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                        <path d="M15 5v10M10 8.5a9 9 0 1 0 10 0" fill />
                                    </g>
                                </g>
                            </svg>
                            <span>Logout</span>
                        </p>
                    </div>
                </div>
            </p> : <Link className='text-sm p-5 cursor-pointer h-full' to={'/login'}>Login</Link>}
            <Link to="/cart">
                <div className="relative py-2">
                    {totalCartItems !== 0 && <div className="t-0 absolute left-3">
                        <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">{totalCartItems}</p>
                    </div>}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="file:  h-10 w-10 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </div>
            </Link>

        </div>
    </div>;
};

export default Navbar;
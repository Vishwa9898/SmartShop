import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpring, animated, useTransition } from 'react-spring';
import './Register.scss';

import { createShortcut } from '../../utils/KeyBoardShortcuts';
import axios from 'axios';
import Logo from '../../Components/Logo/Logo';


const Register = () => {
    const [ name, setName ] = React.useState('');
    const [ email, setEmail ] = React.useState('');
    const [ password, setPassword ] = React.useState('');
    const [ showPassword, setShowPassword ] = React.useState(false);
    const [ error, setError ] = React.useState('Errorrr');
    const [ showError, setShowError ] = React.useState(false);
    const [ isLoading, setIsLoading ] = React.useState(false);

    const errorStyles = useSpring({
        transform: showError ? 'translateX(0px)' : 'translateX(-10px)',
        opacity: showError ? 1 : 0,
    });
    const loadingStyles = useSpring({
        opacity: isLoading || showError ? 0.5 : 1,
    });
    const textAnimConfig = {
        from: { transform: 'translateY(-10px)', opacity: 0 },
        to: { transform: 'translateY(0px)', opacity: 1 },
        enter: { transform: 'translateY(0px)', opacity: 1 },
        leave: { transform: 'translateY(-10px)', opacity: 0 },
    };
    const btnStyles = useTransition(isLoading, textAnimConfig);
    const showPasswordStyles = useTransition(showPassword, {
        from: { transform: 'translateX(-10px)', opacity: 0 },
        to: { transform: 'translateX(0px)', opacity: 1 },
        enter: { transform: 'translateX(0px)', opacity: 1 },
        leave: { transform: 'translateX(10px)', opacity: 0 },
    });

    const navigate = useNavigate();
    const onRegister = async () => {
        setIsLoading(true);
        if (showError) return setIsLoading(false);

        if (!password && !email) {
            setError('Please fill all the fields');
            setShowError(true);
            setIsLoading(false);
            return;
        }
        if (!email) {
            setError('Please enter email');
            setShowError(true);
            setIsLoading(false);
            return;
        }
        if (!password) {
            setError('Please enter password');
            setShowError(true);
            setIsLoading(false);
            return;
        }
        if (!/^[a-zA-Z]+.$/.test(name)) {
            setError('Please enter valid name');
            setShowError(true);
            setIsLoading(false);
            return;
        }
        if (!/\w@\w./.test(email)) {
            setError('Invalid Email');
            setShowError(true);
            setIsLoading(false);
            return;
        }

        try {
            const resp = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/auth/signup`, {
                name,
                email,
                password,
                role: 'user',

            })
    
            localStorage.setItem('token', resp.data.token);
            navigate('/');
            setShowError(false);
            setIsLoading(false);
        } catch (error) {
            console.dir(error);
            setError(error.response.data.message);
            setShowError(true);
            setIsLoading(false);
        }
    };

    return (
        <div className='register--container'>
            <Logo />
            <section className='register'>
                <div className='register-box'>


                    <form className='register--form' onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor='name'>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setShowError(false);
                                }}
                                onKeyDown={(event) => {
                                    createShortcut({
                                        event,
                                        key: 'Enter',
                                        callback: onRegister,
                                        options: {
                                            preventDefault: true,
                                        },
                                    });
                                }}
                                placeholder='Name'
                                id='name'
                                autoComplete='name'
                                name='name'
                                className='register--input'
                            />
                        </label>
                        <label htmlFor='email'>
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setShowError(false);
                                }}
                                onKeyDown={(event) => {
                                    createShortcut({
                                        event,
                                        key: 'Enter',
                                        callback: onRegister,
                                        options: {
                                            preventDefault: true,
                                        },
                                    });
                                }}
                                placeholder='Email'
                                id='email'
                                autoComplete='email'
                                name='email'
                                className='register--input'
                            />
                        </label>
                        <label htmlFor='password'>
                            <div className='register--showPassword--container'>
                                <span
                                    style={{
                                        position: 'relative',
                                    }}
                                    className='register--showPassword'
                                >
                                    {showPasswordStyles((styles, item) => (
                                        <animated.span
                                            style={{
                                                ...styles,
                                                position: 'absolute',
                                                right: 0,
                                            }}
                                            tabIndex={0}
                                            onClick={() =>
                                                setShowPassword((prevShowPassword) => !prevShowPassword)
                                            }
                                            role='button'
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    setShowPassword(
                                                        (prevShowPassword) => !prevShowPassword,
                                                    );
                                                }
                                            }}
                                        >
                                            {!item ? 'Show Password' : 'Hide Password'}
                                        </animated.span>
                                    ))}
                                </span>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setShowError(false);
                                }}
                                onKeyDown={(e) => {
                                    createShortcut({
                                        key: 'Enter',
                                        callback: onRegister,
                                        event: e,
                                        options: {
                                            preventDefault: true,
                                        },
                                    });
                                    createShortcut({
                                        key: 'h',
                                        callback: () => {
                                            setShowPassword((prevShowPassword) => !prevShowPassword);
                                        },
                                        event: e,
                                        options: {
                                            preventDefault: true,
                                            ctrlKey: true,
                                        },
                                    });
                                }}
                                placeholder='Password'
                                id='password'
                                autoComplete='new-password'
                                name='password'
                                className='register--input'
                            />
                        </label>


                        <animated.button
                            type='submit'
                            className='register--submit'
                            onClick={onRegister}
                            style={loadingStyles}
                        >
                            {btnStyles((styles, item) => (
                                <animated.span
                                    style={{
                                        ...styles,
                                        position: 'absolute',
                                    }}
                                >
                                    {!item ? 'Register' : 'Loading'}
                                </animated.span>
                            ))}
                        </animated.button>
                    </form>

                    <p className='register--link'>
                        Already have a Account? <Link to='/login'>Login</Link>
                    </p>
                    <animated.p className='register--error' style={errorStyles}>
                        {error || ' '}
                    </animated.p>
                </div>
            </section>
        </div>
    );
};

export default Register;
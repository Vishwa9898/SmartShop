import React, { useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import { useParams, useSearchParams } from 'react-router-dom';
import './ProductPage.scss';
import APIService from '../../utils/ApiService';
import ReactStars from 'react-rating-stars-component'
import { rem } from '@mantine/core';
import Navbar from '../../Components/Navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Slices/Cart';
import { toast } from 'react-toastify';
const ProductPage = () => {
    const { productId } = useParams();
    const [ canReview, setCanReview ] = React.useState(false);
    const [ rating, setRating ] = React.useState(0);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ sorting, setSorting ] = React.useState(searchParams.get('sort') || 'Newest');
    const [ filter, setFilter ] = React.useState(searchParams.get('filter') || '1 star & above');
    const [ title, setTitle ] = React.useState('');
    const [ description, setDescription ] = React.useState('');
    const [ product, setProduct ] = React.useState({
        image: [],
    });
    const [ reviews, setReviews ] = React.useState([]);
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            const resp = await APIService.GET(`/products/${productId}`);
            setProduct(resp.data.product);
            const resp2 = await APIService.GET(`/products/${productId}/reviews`);
            setReviews(resp2.data.reviews);
            const resp3 = await APIService.GET(`/can-review/${productId}`);
            setCanReview(resp3.data.canReview);

            setRating(resp3.data.review.rating);
            setTitle(resp3.data.review.title);
            setDescription(resp3.data.review.description);
        })();
    }, [])
    const onReview = async () => {
        const resp = await APIService.POST(`/products/${productId}/review`, { rating, title, description });
        const resp2 = await APIService.GET(`/products/${productId}/reviews`);
        setReviews(resp2.data.reviews);
        toast.success(resp.data.message);
    }
    useEffect(() => {
        (async () => {
            const resp = await APIService.GET(`/products/${productId}/reviews?sort=${sorting}&filter=${encodeURI(filter)}`);

            setReviews(resp.data.reviews);
        })();
    }, [ sorting, filter ])
    const getSearch = () => {
        const search = searchParams.toString();
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : '';

    }
    const addToCartClick = async () => {
        dispatch(addToCart(product));
    }

    return <div className=''>
        <Navbar />
        <div className='flex p-4 max-h-[50rem] max-md:flex-col'>
            <Carousel className='w-2/5 aspect-square max-md:w-full max-md:h-[30rem] overflow-hidden'
                withIndicators
                slideGap="md"
                loop
                align="start"
                styles={{
                    indicator: {
                        width: rem(12),
                        height: rem(4),
                        transition: 'width 250ms ease',
                        backgroundColor: 'white !important',
                        zIndex: 1000,
                        '&[data-active]': {
                            width: rem(40),
                        },
                    },
                }} >

                {product.image.map((image, index) => {
                    return <Carousel.Slide > <img className='w-full h-full z-0 aspect-square object-cover' key={index} src={image.url} alt={product.name} /></Carousel.Slide>
                })}
            </Carousel>
            <div className="flex flex-col p-4 w-1/2 max-md:w-full ">
                <h1 className='text-4xl font-bold'>{product.name}</h1>
                <p className='flex-grow'>
                    {product.description}
                </p>
                <div className="flex gap-2">
                    <p className="mt-1 text-left text-lg line-through opacity-50">${product.price}</p>
                    <p className="mt-1 text-left text-xl ">${product.discounted_price}</p>
                </div>
                <button onClick={addToCartClick} className="border-none cursor-pointer text-white text-md font-semibold bg-green-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-105 ">Add to Cart</button>

            </div>

        </div>
        <div className="p-4 flex flex-col items-center mb-10">
            <h3 className='text-3xl text-center text-blue-500 m-4'>Customer Reviews</h3>
            {canReview && <div className="flex flex-col w-full gap-2 max-w-[70rem] mb-10">
                <h3 className='text-3xl'>
                    Write a Review
                </h3>
                <div className="flex  items-center ">
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={(newRating) => setRating(newRating)}
                        size={24}
                        activeColor="#ffd700"
                    />

                </div>

                <div className="flex items-center flex-col ">
                    <label htmlFor="title">
                        Title
                    </label>
                    <input type="text" name="title" id="title" className="w-full rounded-md border border-gray-300 p-4" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex items-center flex-col ">
                    <label htmlFor="description">
                        Description
                    </label>
                    <textarea type="text" name="description" id="description" className="w-full rounded-md border border-gray-300 p-4" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button onClick={onReview} className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-105'>
                    Submit
                </button>
            </div>
            }
            <div className="filters">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center ">
                        <label className="mr-2 text-xl" htmlFor="rating">
                            Rating
                        </label>
                        <select
                            name="rating"
                            id="rating"
                            className="rounded-md border border-gray-300 p-4"
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setSearchParams({ ...getSearch(), filter: e.target.value });
                            }}

                        >
                            <option value="1 star and above">1 star & above</option>
                            <option value="2 star and above">2 star & above</option>
                            <option value="3 star and above">3 star & above</option>
                            <option value="4 star and above">4 star & above</option>
                            <option value="5 stars">5 Stars</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2 text-xl" htmlFor="rating">
                            Sort By
                        </label>
                        <select
                            name="rating"
                            id="rating"
                            className="rounded-md border border-gray-300 p-4"
                            value={sorting}
                            onChange={(e) => {
                                setSorting(e.target.value);
                                setSearchParams({ ...getSearch(), sort: e.target.value });
                            }}

                        >
                            <option value="Newest"> Newest </option>
                            <option value="Oldest"> Oldest </option>
                            <option value="Highest"> Highest </option>
                            <option value="Lowest"> Lowest </option>

                        </select>
                    </div>

                </div>
            </div>
            {reviews.length > 0 ? <div className="flex flex-col gap-4">
                {reviews.map((review) => <div key={review._id} className="px-4 sm:px-6 lg:px-8 flex-grow">
                    <div
                        className="px-8 py-8 rounded-md shadow-lg bg-white "
                    >
                        <div className="flex space-x-0.5">
                            {new Array(5).fill(0).map((_, i) => <svg

                                className={`${i <= review.rating ? 'text-yellow-300' : 'text-gray-300'} w-5 h-5`}
                                fill={i <= review.rating ? 'currentColor' : 'none'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                key={i}
                            >
                                <path
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                ></path>
                            </svg>)}
                        </div>
                        <p className="mt-2 text-sm font-medium leading-5 text-gray-500">
                            {new Date(review.createdAt).getDate()}.{new Date(review.createdAt).getMonth()}.{new Date(review.createdAt).getFullYear()}
                        </p>
                        <div className="mt-2 flex items-center space-x-1">


                            <p

                                className="text-sm font-medium leading-5 text-gray-500"
                            >
                                Verified purchase
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-800">
                                {review.title}
                            </h3>
                            <p className="text-sm font-medium leading-5 text-gray-600">
                                {review.description}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center space-x-2">

                            <span className="text-sm font-semibold leading-5 text-gray-900">
                                {review.user.name}
                            </span>
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>)}
            </div>
                : <h3 className='text-3xl text-center text-blue-500 m-4'>No Reviews</h3>
            }

        </div>
    </div>;
};

export default ProductPage;
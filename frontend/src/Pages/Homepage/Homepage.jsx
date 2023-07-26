import React, { useEffect } from 'react';
import './Homepage.scss';
import Card from '../../Components/Card/Card';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import APIService from '../../utils/ApiService';
import { Pagination } from '@mantine/core';
const Homepage = () => {
    const navigate = useNavigate();
    const {category} = useParams();
    const [ products, setProducts ] = React.useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ sorting, setSorting ] = React.useState(searchParams.get('sort') || 'Newest First');
    const [ productsInfo, setProductsInfo ] = React.useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [ categories, setCategories ] = React.useState([]);
    const [ currentCategory, setCurrentCategory ] = React.useState(category || '');
    const [ q, setQ ] = React.useState(searchParams.get('q') || '');
    const [ currentPage, setCurrentPage ] = React.useState(Number(searchParams.get('page')) || 1);
 
    useEffect(() => {
        (async () => {
            setCurrentCategory(category);
            const resp = await APIService.GET(`/products?limit=12&q=${q}&category=${currentCategory || ''}&page=${currentPage}&sort=${sorting}`);
        
            setProducts(resp.data.products);
            setProductsInfo({
                page: resp.data.page,
                total: resp.data.total,
                totalPages: resp.data.totalPages,
            });
        })();

    }, [ q, currentCategory, currentPage, sorting,location.pathname ])
    const getSearch = () => {
        const search = searchParams.toString();
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : '';

    }
    useEffect(() => {
        (async () => {
            const resp2 = await APIService.GET('/categories');
            setCategories(resp2.data.categories);
        })();
    }, [])
    return <div className=''>
        <Navbar />
        {location.pathname !== '/' && <div className='w-full flex justify-center mt-4'>
            <input placeholder='Search' className='w-full max-w-[70rem] p-2 text-lg  bg-transparent border border-black border-b-2 border-y-0 border-x-0 focus:outline-none' type="text" value={q} onChange={(e) => {
                setQ(e.target.value);
                setSearchParams({ ...getSearch(), q: e.target.value });
                setCurrentPage(1);
            }} />
        </div>}
        <div className="flex">
            <div className="flex justify-center items-center w-full">
                <div className="flex gap-5 mt-5 overflow-auto max-w-[70rem] p-4">
                    {categories.map((category, i) => (
                        <div key={i} onClick={() => {
                      
                            if (location.pathname === '/') {
                                navigate(`/${category}`);
                                return;
                            }
                            if (category === 'All' && currentCategory !== '') {
                                setCurrentCategory('');
                                setQ('');
                                setSearchParams({ ...getSearch(), category: '' });
                                setCurrentPage(1);
                            }
                            if (currentCategory === category) {
                                setCurrentCategory('');
                                setQ('');
                                setCurrentPage(1);
                                setSearchParams({ ...getSearch(), category: '' });
                            }
                            else {
                                setCurrentPage(1);
                                setCurrentCategory(category);
                                setQ('');
                                setSearchParams({ ...getSearch(), category });
                                navigate(`/${category}?page=${currentPage}&sort=${sorting}&q=${q}`);
                            }
                        }} className={`flex shadow-md justify-center items-center  rounded-full px-5 py-2 cursor-pointer hover:bg-black hover:text-white transition duration-300 ${category === currentCategory || (category === 'All' && currentCategory === '') ? 'bg-black text-white' : 'bg-white text-black'}`}>
                            {category}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {location.pathname !== '/' && <div className="flex">
            <div className="flex justify-center items-center w-full">
                <div className="flex gap-5 mt-2 overflow-auto max-w-[70rem] p-4 w-full justify-center">
                    {([ 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Oldest First' ]).map((type, i) => (
                        <div key={i} onClick={() => {
                            setSorting(type);
                            setSearchParams({ ...getSearch(), sort: type });
                        }}  className={`flex whitespace-nowrap shadow-md justify-center items-center   rounded-full px-5 py-2 cursor-pointer hover:bg-black hover:text-white transition duration-300   ${sorting === type ? 'bg-black text-white' : 'bg-white text-black'}`}>
                            {type}
                        </div>
                    ))}
                </div>
            </div>
        </div>}
        <div className='flex justify-center mt-4 w-full mb-10'>
            <div className='grid  w-full gap-4  justify-items-stretch px-10 max-w-[70rem]' style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))'
            }}>
                {products.map((product, i) => <Card key={i} card={product} />)}
            </div>
        </div>
        <div className="mb-5">
            <Pagination total={productsInfo.totalPages} value={currentPage} onChange={(page) => {
                setCurrentPage(page);
                setSearchParams({ ...getSearch(), page });
            }} position='center' styles={(theme) => ({

                control: {

                    '&[data-active]': {

                        backgroundImage: theme.fn.gradient({ from: 'red', to: 'yellow' }),
                        border: 0,
                    }
                },
            })} />
        </div>
    </div>;
};

export default Homepage;
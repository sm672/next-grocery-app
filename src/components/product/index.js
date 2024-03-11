import React, { useEffect, useState, useContext } from 'react';
import './style.css';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import Link from 'next/link';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { fetchDataFromApi } from '@/utils/api';

import { MyContext } from '@/context/ThemeContext';


const Product = (props) => {

    const [productData, setProductData] = useState();
    const [isAdded, setIsadded] = useState(false);


    const context = useContext(MyContext);

    useEffect(() => {
        setProductData(props.item);

        //console.log(props.item)
    }, [props.item])

    const setProductCat = () => {
        sessionStorage.setItem('parentCat', productData.parentCatName);
        sessionStorage.setItem('subCatName', productData.subCatName);
    }


    const addToCart = (item) => {
        getData(`/api/cart-datas?populate=*&[filters][productId]=${item.id}`, item);

    }

    const getData = (url, item) => {
        fetchDataFromApi(url).then(res => {
            if (res.data.length === 0) {
                context.addToCart(item);
                setIsadded(true);
            }

        })
    }





    return (
        <div className='productThumb' onClick={setProductCat}>
            {
                props.tag !== null && props.tag !== undefined &&
                <span className={`badge ${props.tag}`}>{props.tag}</span>
            }

            {
                productData !== undefined &&
                <>
                    <Link href={`/product/${props.itemId}`}>
                        <div className='imgWrapper'>
                            <div className='p-4 wrapper mb-3'>
                                <img src={'http://localhost:1337' + productData.attributes.productImages.data[0].attributes.url} className='w-100' alt='productImage' />
                            </div>

                            <div className='overlay transition'>
                                <ul className='list list-inline mb-0'>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Add to Wishlist">
                                            <FavoriteBorderOutlinedIcon />
                                        </a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Compare">
                                            <CompareArrowsOutlinedIcon />
                                        </a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Quick View">
                                            <RemoveRedEyeOutlinedIcon />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </Link>

                    <div className='info position-relative'>
                        <span className='d-block catName'>Brand Name</span>
                        <h4 className='title'><Link href="/">{productData.attributes.name.substr(0, 50) + '...'}</Link></h4>
                        <Rating name="half-rating-read"
                            value={parseFloat(productData.attributes.rating)} precision={0.5} readOnly />
                        <span className='brand d-block text-g'>By <Link href="/" className='text-g'>Product BrandLink</Link></span>

                        <div className='d-flex align-items-center mt-3'>
                            <div className='d-flex align-items-center w-100'>
                                <span className='price text-g font-weight-bold'>
                                    Rs {productData.attributes.price}</span> <span className='oldPrice ml-auto'>Rs {productData.attributes.oldPrice}</span>
                            </div>
                        </div>

                        <Button className='w-100 transition mt-3' onClick={() => addToCart(productData)}><ShoppingCartOutlinedIcon />
                            {
                                isAdded === true ? 'Added' : 'Add'
                            }
                        </Button>

                    </div>

                </>
            }






        </div>
    )
}

export default Product;
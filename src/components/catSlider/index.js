import React, { useEffect, useRef, useState, useContext } from 'react';
import Slider from "react-slick";
import './style.css';
import Link from 'next/link';

import { MyContext } from '../../context/ThemeContext';

const CatSlider = (props) => {

    const [allData, setAllData] = useState();
    const [totalLength, setTotalLength] = useState([]);
    const context = useContext(MyContext);

    const [itemBg, setItemBg] = useState([
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec'
    ]);

    const slider = useRef();


    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        fade: false,
        arrows: context.windowWidth > 992 ? true : false,
        autoplay: context.windowWidth > 992 ? 2000 : false,
        centerMode: context.windowWidth > 992 ? true : false
    };

    useEffect(() => {
        setAllData(props.data)
    }, [])


    return (
        <>
            <div className='catSliderSection'>
                <div className='container-fluid' ref={slider}>
                    <h2 className='hd'>Featured Categories</h2>
                    <Slider {...settings} className='cat_slider_Main' id="cat_slider_Main" >


                        {
                            props.data!==undefined && props.data.length !== 0 &&
                            props.data.data?.map((item, index) => {

                                return (
                                    <div className='item' key={index} >
                                       
                                        <Link href={`/cat/${item.attributes.title.toLowerCase()}`}>
                                            <div className='info' style={{ background: itemBg[index] }}>
                                                <img src={'http://localhost:1337'+item.attributes.img.data.attributes.url} width="80" />
                                                <h5 className='text-capitalize mt-3'>{item.attributes.title}</h5>
                                                <p>
                                                {item.attributes.products.data.length}  items 
                                                    
                                                    </p>
                                            </div>
                                        </Link>

                                    </div>
                                )
                            })
                        }







                    </Slider>
                </div >
            </div >



        </>
    )
}

export default CatSlider;
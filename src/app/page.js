"use client"
import { useContext, useEffect, useState, useRef } from 'react';
import SliderBanner from '../components/slider/index';
import CatSlider from '@/components/catSlider';

import { MyContext } from '@/context/ThemeContext';
import { fetchDataFromApi } from '@/utils/api';
import Banners from '@/components/banners';
import Product from '@/components/product';
import Banner4 from '../assets/images/banner4.jpg';
import Slider from "react-slick";
import Image from 'next/image';
import TopProducts from '@/components/TopProducts';

export default function Home() {

  const [productData, setProductData] = useState([]);
  const [catArray, setcatArray] = useState([]);
  const [activeTab, setactiveTab] = useState();
  const [activeTabIndex, setactiveTabIndex] = useState(0);
  const [activeTabData, setActiveTabData] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [bestSells, setBestSells] = useState([]);

  const productRow = useRef();

  const context = useContext(MyContext);


  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth < 992 ? false : true,
  };



  useEffect(() => {

    getData("/api/categories?populate=*");

    getBestSellerData(`/api/products?populate=*&[filters][sub_cats][title]=${'Mobiles and Tablets'}`)
   
    window.scrollTo(0, 0);
  }, []);




  const cat_ARR = [];
  const getData = (apiUrl) => {
    fetchDataFromApi(apiUrl).then(res => {
      setProductData(res);
      context.setProductData(res.data);


      res.data.length !== 0 && res.data.map((item) => {
        item.attributes.sub_cats.data.map((subCat, index) => {
          cat_ARR.push({
            "title": subCat.attributes.title,
            id: item.id
          })

        })
      })


      const uniqueObject = {};
      const uniqueArray = cat_ARR.filter(obj => {
        const key = JSON.stringify(obj); // Convert object to a string for uniqueness
        return uniqueObject.hasOwnProperty(key) ? false : (uniqueObject[key] = true);
      });

      setcatArray(uniqueArray);

      filterBySuCat(uniqueArray[0].title)
    })
  }


  const getBestSellerData = (apiUrl) => {
    fetchDataFromApi(apiUrl).then(res => {
      setBestSells(res);
    })
  }



  var filterProducts = [];

  const filterBySuCat = (title) => {
    filterProducts = [];
    fetchDataFromApi(`/api/products?populate=*&[filters][sub_cats][title]=${title}&pagination[start]=0&pagination[limit]=10`).then(res => {
      //console.log(res.data);

      res.data?.length !== 0 && res.data !== undefined &&
        res.data?.map((item) => {
          filterProducts.push(item)
        })

      setActiveTabData(filterProducts);

      setTimeout(() => {
        setIsLoadingProducts(false);
      }, [500]);

    })
  }

  return (
    <>
      <div style={{ display: 'block' }}>

        <SliderBanner />

        {
          productData?.length !== 0 && productData !== undefined && <>
            <CatSlider data={productData} />
            <Banners />



            <section className='homeProducts homeProductWrapper'>
              <div className='container-fluid'>
                <div className='d-flex align-items-center homeProductsTitleWrap'>
                  <h2 className='hd mb-0 mt-0 res-full'>Popular Products</h2>
                  <ul className='list list-inline ml-auto filterTab mb-0 res-full'>


                    {
                      catArray?.length !== 0 && catArray?.map((subCat, index) => {
                        return (
                          <li className="list list-inline-item" key={index}>

                            <a className={`cursor text-capitalize 
                                                  ${activeTabIndex === index ? 'act' : ''}`}
                              onClick={() => {
                                setactiveTab(subCat.title)
                                setactiveTabIndex(index);
                                productRow.current.scrollLeft = 0;
                                setIsLoadingProducts(true);
                                filterBySuCat(subCat.title)
                              }}
                            >
                              {subCat.title}
                            </a>
                          </li>
                        )
                      })
                    }



                  </ul>
                </div>



                <div className={`productRow ${isLoadingProducts === true && 'loading'}`} ref={productRow}>

                  {
                    activeTabData?.length !== 0 &&
                    activeTabData?.map((item, index) => {
                      return (
                        <div className='item' key={index}>
                          <Product item={item} itemId={item.id} />
                        </div>
                      )
                    })
                  }

                </div>

              </div>
            </section>
          </>
        }


        {
          bestSells?.length !== 0 && bestSells !== undefined &&
          <>
            <section className='homeProducts homeProductsRow2 pt-0 bestseller'>
              <div className='container-fluid'>
                <div className='d-flex align-items-center'>
                  <h2 className='hd mb-0 mt-0'>Daily Best Sells</h2>

                </div>

                <br className='res-hide' /><br className='res-hide' />
                <div className='row'>
                  <div className='col-md-3 pr-5 res-hide'>
                    <Image src={Banner4} className='w-100' alt='banner image' />
                  </div>

                  <div className='col-md-9'>
                    <Slider {...settings} className='prodSlider'>
                      {
                        bestSells?.data?.length !== 0 && bestSells?.data !== undefined &&
                        bestSells?.data?.map((item, index) => {
                          return (
                            <div className='item' key={index}>
                              <Product item={item} itemId={item.id}/>
                            </div>
                          )
                        })
                      }

                    </Slider>
                  </div>
                </div>


              </div>
            </section>




            <section className='topProductsSection'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col'>
                    <TopProducts title="Top Selling" />
                  </div>

                  <div className='col'>
                    <TopProducts title="Trending Products" />
                  </div>

                  <div className='col'>
                    <TopProducts title="Recently added" />
                  </div>

                  <div className='col'>
                    <TopProducts title="Top Rated" />
                  </div>

                </div>
              </div>
            </section>
          </>
        }




      </div>
    </>
  )
}

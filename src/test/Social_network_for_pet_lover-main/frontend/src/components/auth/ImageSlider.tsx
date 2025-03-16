import Slider from "react-slick";
import React from 'react'
import { Box, Typography } from '@mui/material'
import { APP_NAME } from "../../constants/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";

// const images = [
//     "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBldHxlbnwwfHwwfHx8MA%3D%3D",
//     "https://plus.unsplash.com/premium_photo-1710406095492-7e62eba19745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGV0fGVufDB8fDB8fHww",
//     "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhdHxlbnwwfHwwfHx8MA%3D%3D"];

const images = [
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBldHxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1710406095492-7e62eba19745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGV0fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhdHxlbnwwfHwwfHx8MA%3D%3D"];


// const images = [
//     'https://cdn.shopify.com/s/files/1/0273/0305/1400/files/linen-shirt-khaki-57_480x480.jpg?v=1681878378',
//     'https://cdn.shopify.com/s/files/1/0273/0305/1400/files/what_is_green_fashion_480x480.jpg?v=1677618141',
//     'https://cdn.shopify.com/s/files/1/0273/0305/1400/files/Sea-Khaki_-Blue_-Black-_-Pink-Neon-Linen-Dress-by-Seaside-Tones-Seaside-Tones-1667386724_900x_a2b5c12d-3633-4a2d-af8a-d7145f610782_480x480.webp?v=1678700589',
// ];
const ImageSlider: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 2000,
    };

    return (
        <Box component="div" className="custom-slider" position="relative" sx={{ width: '100%', height: '100%' }}>
            <Slider {...settings}

            >
                {images.map((src, index) => (
                    <div key={index}>
                        <img src={src} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100vh' }} />
                    </div>
                ))}
            </Slider>

            <Box component="div" className="Description" position="absolute" bottom="20px" width = "50%" height= "30%"  paddingLeft= "10%"

            >

                <Typography
                    variant="h2" color="#cbccc3" align="left" gutterBottom
                >
                    {APP_NAME}
                </Typography>
                <Typography
                    variant="body2" color="#ACBAA4" align="left" width= "100%" gutterBottom
                >
                    Welcome to Fashionista the social network for fashion lovers! Connect, share, and get inspired by a vibrant community that celebrates all things style.
                </Typography>
            </Box>
        </Box>
    );
};

export default ImageSlider;

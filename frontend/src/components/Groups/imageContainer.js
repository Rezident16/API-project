import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './images.css'

function GroupImages({group}) {
    const images = group.GroupImages.map(image => image.url);

    return (
        <div className="box">
          <Carousel useKeyboardArrows={true}>
            {images.map((URL, index) => (
              <div className="slide">
                <img className='groupImages' src={URL} key={index} />
              </div>
            ))}
          </Carousel>
        </div>
      );
}

export default GroupImages;

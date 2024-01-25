import React, { useState } from 'react';
import { Card, Button } from 'reactstrap';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const items = [
    {
        src: 'https://www.gqrgm.com/wp-content/uploads/2019/09/2.-Blog-Banner-Template.jpg',
        altText: 'Slide 1',
        title: 'CoAI',
        caption: 'Unleashing Collective Intelligence with AI-Enhanced Responses',
        link: '/ask',
        linkText: 'Go to Ask Question',
        key: 1,
    },
    {
        src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXIlMjBjb2RlfGVufDB8fDB8fHww',
        altText: 'Slide 2',
        title: 'CoAI',
        caption: 'Fostering Vibrant Interaction and Active Engagement in the Developer Community',
        link: '/questions',
        linkText: 'Go to See Recent Questions',
        key: 1,
    },
];

export default function HeroImage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
                style={{ overflow: 'hidden' }} // 추가된 부분
            >
                <img
                    src={item.src}
                    alt={item.altText}
                    style={{
                        width: '100%',   // 이미지의 너비를 100%로 설정
                        height: '450px',  // 이미지의 높이를 100%로 설정
                        objectFit: 'cover', // 이미지를 확대 또는 축소하여 자르기
                        filter: 'blur(5px)',
                    }}
                /><div
                    className='mask position-absolute top-0 start-0 w-100 h-100'
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', clipPath: 'inset(0)' }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center text-center position-absolute top-0 start-0 w-100 h-100">
                    <div style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '60px', fontFamily: 'HackBold', marginBottom: '10px' }}>
                        {item.title}
                    </div>
                    <div style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '15px', marginBottom: '50px' }}>
                        {item.caption}
                    </div>
                    <Link to={item.link}>
                        <Button color='primary'>
                            {item.linkText}
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                    </Link>
                </div>
            </CarouselItem>
        );
    });

    return (
        <header style={{ paddingLeft: 0, marginBottom: '30px' }}>
            {/* <Card className='text-center position-relative' style={{ height: 450, overflow: 'hidden' }}>
                <div
                    className='bg-image position-absolute top-0 start-0 w-100 h-100'
                    style={{
                        backgroundImage: "url('https://www.gqrgm.com/wp-content/uploads/2019/09/2.-Blog-Banner-Template.jpg')",
                        backgroundSize: 'cover',
                        filter: 'blur(8px)',
                    }}
                ></div>
                <div
                    className='mask position-absolute top-0 start-0 w-100 h-100'
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', clipPath: 'inset(0)' }}
                >
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className='text-white'>
                            <h1 className='mb-3'>CoAI</h1>
                            <h4 className='mb-3'>Catchphrase</h4>

                            <Link to="/ask">
                                <Button className="btn" outline color="primary">
                                    Go to ask  question
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card> */}
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
            >
                <CarouselIndicators
                    items={items}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                />
                {slides}
                <CarouselControl
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={previous}
                />
                <CarouselControl
                    direction="next"
                    directionText="Next"
                    onClickHandler={next}
                />
            </Carousel>
        </header>
    );
}
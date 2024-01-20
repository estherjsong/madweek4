import React from 'react';
import { Card, Button } from 'reactstrap';

export default function HeroImage() {
    return (
        <header style={{ paddingLeft: 0, marginBottom: '30px' }}>
            <Card className='text-center position-relative' style={{ height: 450, overflow: 'hidden' }}>
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
                            <h1 className='mb-3'>Website Name</h1>
                            <h4 className='mb-3'>Catchphrase</h4>
                            <Button className="btn" outline color="primary">
                                Go to ask  question 
                                <i class="bi bi-arrow-right"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </header>
    );
}
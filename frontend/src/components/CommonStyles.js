import styled from "styled-components";

export const WhiteBox = styled.div`
    display: flex;
    
    flex-direction: column;
    justify-content: center;
    border-radius: ${props => props.rad || '20px'};
    padding: 20px;
    background-color: rgba(255, 255, 255, ${props => props.opacity || 1});
    width: ${props => props.width || '500px'};
    height: ${props => props.height};
    margin: 0 auto;
    z-index: 5;
`;

export const BackgroundOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); // Adjust the transparency as needed
    z-index: 1000; // Make sure it's on top of other elements
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0; // Set initial opacity to 0
    transition: opacity 1s ease-in-out; // Apply transition to opacity
    ${({ isVisible }) => isVisible && 'opacity: 1;'} // Conditional styling based on isVisible prop
`;

export const BackgroundImg = styled.img`
position: absolute;
top: 50;
left: 0;
width: 100%;
height: calc(100vh + 400px);
object-fit: cover;
// transform: translateY(-30px);
margin: 0 auto;
filter: blur(8px); /* 블러 효과 크기 조절 가능 */
z-index: -1;
opacity: 0.5
`;

export const OutlineBtn = styled.button`
    font-weight: 600;
    border-style: groove;
    // border-width: medium;
    border-radius: 40px;
    border-color: transparent;
    background: transparent;
    color: ${props => props.color || '#1864ab'};
    border: ${props => props.outline || '1px solid #1864ab'};
    overflow: hidden;
    transition: 0.3s;
    width: ${props => props.width || '100px'};
    height: ${props => props.height || '30px'};

    &:hover {
        transform: scale(1.1);
    }
`;


export const DateBtn = styled.button`
border-radius: 40px;
border-color: transparent;
background: transparent;
color: #1864ab;
border: 1px solid #1864ab;
width: 100px
`;

export const FilledBtn = styled.button`
background-color: ${props => props.fill || '#150026'};
backgroud:${props => props.gradient};
color: ${props => props.color || 'white'};
font-weight: 300;
border: none;
border-radius:30px;
overflow: hidden;
transition: 0.3s;
width: ${props => props.width || '100px'};
height: ${props => props.height || '30px'};

&:hover {
    transform: scale(1.1);
}
`;

export const ModalContent = styled.div`
    background: white;
    width: 500px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1001; // Make sure it's on top of the overlay
    opacity: 0; // Set initial opacity to 0
    transform: translateY(20px); // Set initial position below the viewport
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; // Apply transition to opacity and transform
    ${({ isVisible }) => isVisible && 'opacity: 1; transform: translateY(0);'} // Conditional styling based on isVisible prop
`;
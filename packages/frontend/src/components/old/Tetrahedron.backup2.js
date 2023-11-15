import { Box } from "@mui/material"
import { useState } from "react"

const Face = props => {
    const { size, side } = props;

    const color = ['#f005', '#0f05', '#00f5', '#f0f5'][side]

    const height = Math.cos(Math.PI / 6) * size,
        offsetY = (size - height) * 0.5,
        heightOfPyramid = Math.sqrt(2/3) * size

    const PI = Math.PI;
    const P2 = PI / 2
    const P3 = PI / 3

    console.log({ height })


    return <Box sx={{
        position: 'absolute', left: 0, top: 0, width: size, height: size,
        transformOrigin: `${size * 0.5}px ${size * 0.5}px`,
        //backfaceVisibility:'visible',
        transformStyle: 'preserve-3d',
        transform: [
            `rotateY(${P2}rad) rotateZ(90deg)`,
            `rotateX(${0}rad)`,
            `rotateX(${P3}rad)`,
            `rotateX(${P3 * 2}rad)`,
        ][side]
    }}>
        <Box sx={{
            position: 'absolute', left: 0, top: 0, width: size, height: size,
            transformOrigin: `${size * 0.5}px ${size * 0.5}px`,
            //backfaceVisibility:'visible',
            transformStyle: 'preserve-3d',
            transform:[
                `translateZ(${-heightOfPyramid*0.5}px) `,
                ,
            ][side]
        }}>
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                <polygon
                    fill={color}
                    points={`${offsetY},0 ${height + offsetY},${size * 0.5} ${offsetY},${size}` }
                    stroke='white' strokeWidth={1}
                />
                {/* <polygon 
                fill={color}
                points={`0,0 0,${size} ${size},${size} ${size},0`} 
                stroke='white' strokeWidth={1} 
            /> */}
            </svg>
        </Box>
    </Box>
}

const Tetrahedron = props => {


    const size = 300;


    const [rotation, setRotation] = useState([0, 0, 0])
    const randomizeRotation = () => {
        setRotation(p => {
            return p.map(v => {
                return v + Math.random() * Math.PI * 0.5
            })
        })
    }

    return <Box
        onClick={randomizeRotation}
        sx={{
            width: size,
            height: size,
            border: '1px solid white',
            cursor: 'pointer',
            boxSizing: 'content-box',
            m: 10
        }}>
        <Box sx={{
            transition: 'transform 0.5s',
            transformOrigin: `${size * 0.5}px ${size * 0.5}px`,
            perspective: '10000px',
            transform: `rotateX(${rotation[0]}rad) rotateY(${rotation[0]}rad) rotateZ(${rotation[0]}rad)`,
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: size,
            height: size


        }}>
            <Face size={size} side={0} />
            <Face size={size} side={1} />
            <Face size={size} side={2} />
            <Face size={size} side={3} />
        </Box>
    </Box>
}

export default Tetrahedron
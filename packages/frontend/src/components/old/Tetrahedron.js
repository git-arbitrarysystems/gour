import { Box } from '@mui/material'

import { useEffect, useState } from 'react';

const commonFaceStyles = (width, height) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height || width,
    transformStyle: 'preserve-3d',
    transformOrigin: `${width * 0.5}px ${(height || width) * 0.5}px`
})

const deg = rad => {
    return ( rad / Math.PI ) * 180
}
const rad = deg => {
    return ( deg / 180 ) * Math.PI
}


const CubeFace = props => {
    const { size, index } = props;
    return <Box sx={{
        ...commonFaceStyles(size),

        transform: [
            `translateZ(${size * 0.5}px)`,
            `translateZ(${-size * 0.5}px)`,
            `rotateX(90deg) translateZ(${size * 0.5}px)`,
            `rotateX(90deg) translateZ(${-size * 0.5}px)`,
            `rotateY(90deg) translateZ(${size * 0.5}px)`,
            `rotateY(90deg) translateZ(${-size * 0.5}px)`
        ][index]

    }}>
        <svg viewBox={`0 0 ${size} ${size}`}>
            <rect fill="transparent" strokeWidth={1} stroke='#000' x={0} y={0} width={size} height={size} />
        </svg>
    </Box>
}

const TriangleSurface = props => {
    const { size, th, color } = props;

    return <svg viewBox={`0 0 ${size} ${size}`}>
        <rect fill="transparent" strokeWidth={1} stroke='#fff9' x={0} y={0} width={size} height={size} />
        <polygon points={`${size*0.5},0 ${size},${th} 0,${th}`}
            fill="transparent" strokeWidth={1} stroke={color} />
    </svg>
}

const TetrahedronFace = props => {
    const { size, index } = props;

    const color = ['#f00', '#0f0', '#00f', '#0ff'][index]

    const triangleHeight = Math.cos(Math.PI / 6) * size
    const FA = (Math.PI * 0.5 - Math.acos(1 / 3)); /* *FACE ANGLE */
    const PI_3 = Math.PI / 3

    const transformOrigin = [
        '50% 0%',
        '50% 0%',
        '50% 0%'
    ][index]

    
    let TZ4 = -Math.sin( FA ) * size

    let transform = [
        `rotateY(${0}rad) rotateX(${FA}rad)`,
        `rotateY(${PI_3 * 2}rad) rotateX(${FA}rad)`,
        `rotateY(${PI_3 * 4}rad) rotateX(${FA}rad)`,
        `rotateX(${90}deg)`
    ][index]

    
     /** Calculate center translation */
     const a = Math.sin( rad(30) );
     const b = Math.sin( rad(60) )
     const translate = (1-b) * 0.5 * size
     //transform = `translateY(${translate}px) translateZ(${translate}px) ${transform}`


    return <Box sx={{
        ...commonFaceStyles(size, size),
        transformOrigin,
        transform
    }}>
        <TriangleSurface size={size} th={triangleHeight} color={color} />
    </Box>
}

const Tetrahedron = props => {

    const size = 400;

    const [normal, setNormal] = useState(0)
    const normals = [
        [0, 0, 0, 0, 0, 0],
        [30, -15, 120, 120, 30, -60]
    ]
    const [normalTransform, setNormalTransform] = useState(normals[normal])
    useEffect(() => setNormalTransform(normals[normal]), [normal])


    const [rotation, setRotation] = useState([0, 0, 0])
    useEffect(() => {
        console.log('rotation:', rotation)
    }, [rotation])



    useEffect(() => {
        const onKeyDown = e => {
            const rotationStep = 15;
            const actions = {
                'ArrowRight': () => setRotation(([x, y, z]) => [x, y + rotationStep, z]),
                'ArrowLeft': () => setRotation(([x, y, z]) => [x, y - rotationStep, z]),

                'ArrowUp': () => setRotation(([x, y, z]) => [x - rotationStep, y, z]),
                'ArrowDown': () => setRotation(([x, y, z]) => [x + rotationStep, y, z]),

                'PageUp': () => setRotation(([x, y, z]) => [x, y, z - rotationStep]),
                'PageDown': () => setRotation(([x, y, z]) => [x, y, z + rotationStep]),

                '0': () => setNormal(0),
                '1': () => setNormal(1),

                'r': () => setRotation([0, 0, 0])
            }

            if (actions[e.key]) {
                actions[e.key]()
                e.preventDefault()
            } else {
                console.log(e.key)
            }




        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)

    }, [])

    const triangleHeight = Math.cos(Math.PI / 6) * size;
      


    return <Box sx={{ m: 10, background: '#fff2' }}>

        <Box sx={{
            width: size,
            height: size,
            background:'#ffc1',
            position: 'relative',
            //perspective: 8000,
            transition: 'transform 0.5s',
            transform: `rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`,
            transformStyle: 'preserve-3d',
        }}>

            {/** Cube */}
            {
                Array(6).fill().map(((n, i) => {
                    return <CubeFace key={`cubaface-${i}`} index={i} size={size} />
                }))
            }
            
            <TetrahedronFace key={`tetrahedronface-${0}`} index={0} size={size} />
            <TetrahedronFace key={`tetrahedronface-${1}`} index={1} size={size} />
            <TetrahedronFace key={`tetrahedronface-${2}`} index={2} size={size} />

            {/* <TetrahedronFace key={`tetrahedronface-${3}`} index={3} size={size} /> */}
           
            
        </Box>
    </Box>
}

export default Tetrahedron
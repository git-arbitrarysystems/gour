import { Box } from '@mui/material'

import { useEffect, useState } from 'react';


const Tetrahedron = props => {

    const w = 300,
        h = Math.cos(Math.PI / 6) * w,
        pa = 90 - (Math.acos(1 / 3) / Math.PI) * 180,
        pyramidHeight = Math.sqrt(2 / 3) * w,
        centerTranslationZ = (1 - 1 / Math.sqrt(2)) * w
    useEffect( () => {
        console.log({centerTranslationZ})
    }, [] )

    
    
    
    const [normal, setNormal] = useState(0)
    const normals = [
        [0, 0, 0, 0, 0, centerTranslationZ],
        [30, -15, 120,120,30,-60]
    ]
    const [normalTransform, setNormalTransform] = useState(normals[normal])
    useEffect( () => setNormalTransform(normals[normal]), [normal])


    const [rotation, setRotation] = useState([0, 0, 0])






    /**
     * roll 1
     * [20,rand,0]
     * [80,-60,160] 
     * 40,-20,120
     * 
     * top 90,0,0
     * */

    

    useEffect(() => {
        console.log('rotation:', rotation)
    }, [rotation])



    useEffect(() => {
        const onKeyDown = e => {
            const rotationStep = 5;
            const actions = {
                'ArrowRight': () => setRotation(([x, y, z]) => [x, y + rotationStep, z]),
                'ArrowLeft': () => setRotation(([x, y, z]) => [x, y - rotationStep, z]),

                'ArrowUp': () => setRotation(([x, y, z]) => [x - rotationStep, y, z]),
                'ArrowDown': () => setRotation(([x, y, z]) => [x + rotationStep, y, z]),

                '0': () => setNormal(0),
                '1': () => setNormal(1),

                'r': () => setRotation([0,0,0])
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


    return <Box sx={{ m: 10, width: w, height: h, background: '#fff2' }}>

        <Box sx={{
            width: w,
            height: h,
            bgcolor: '#ff73',
            transition: 'transform 0.5s',
            transform: `rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`,
            transformStyle: 'preserve-3d',
        }}>

            <Box sx={{
                width: w,
                height: h,
                // bgcolor:'#f373',
                transition: 'transform 0.5s',
                transform: `

                translateX(${normalTransform[3]}px) 
                translateY(${normalTransform[4]}px) 
                translateZ(${normalTransform[5]}px)`,
                transformStyle: 'preserve-3d',
            }}>

            <Box sx={{
                width: w,
                height: h,
                // bgcolor:'#f373',
                transition: 'transform 0.5s',
                transform: `
                rotateX(${normalTransform[0]}deg) 
                rotateY(${normalTransform[1]}deg) 
                rotateZ(${normalTransform[2]}deg) `,

             
                transformStyle: 'preserve-3d',
            }}>


                {Array(4).fill().map((n, i) => {
                    return <Box key={`s${i}`} sx={{
                        width: w,
                        height: h,
                        position: 'absolute',
                        backfaceVisibility: 'hidden',
                        transformOrigin: ['bottom', 'bottom left', 'bottom right', 'bottom'][i],
                        transform: [
                            'rotateX(90deg)',
                            `rotateY(60deg) rotateX(${-pa}deg)`,
                            `rotateY(-60deg) rotateX(${-pa}deg)`,
                            `rotateX(${pa}deg) rotateY(180deg)`][i],


                    }}>

                        <svg viewBox={`0 0 ${w} ${h}`} width={`${w}px`} height={`${h}px`}
                        >
                            <mask id="shape">

                                <polygon
                                    points={`0,${h} ${w},${h} ${0.5 * w},0`}
                                    fill='white'
                                />
                            </mask>

                            <rect x="0" y="0" width={w} height={h} fill={`rgba(${['255,0,0', '0,255,0', '0,0,255', '255,0,255'][i]},1)`} mask='url(#shape)' />
                            {i !== 0 && <rect x={0} y={0} width={w} height={h * 0.25} fill='green' mask="url(#shape)" />}
                            {
                                i == 0 && <polygon
                                    points={`0,${h} ${h * 0.25},${h} 0,${h - Math.sin(Math.PI / 3) * h * 0.5}`}
                                    fill='green' mask="url(#shape)" />
                            }
                            {
                                i == 1 && <polygon
                                    points={`0,${h} ${h * 0.25},${h} 0,${h - Math.sin(Math.PI / 3) * h * 0.5}`}
                                    fill='green' mask="url(#shape)" />
                            }
                            {
                                i == 3 && <polygon
                                    points={`${w},${h} ${w - h * 0.25},${h} ${w},${h - Math.sin(Math.PI / 3) * h * 0.5}`}
                                    fill='green' mask="url(#shape)" />
                            }
                        </svg>
                    </Box>


                })}
            </Box>

            </Box>

        </Box>

    </Box>



    /**
     * 
     * What is the internal angle between the two faces of a regular ...
The internal angle between the two faces of a regular tetrahedron is approximately 70.53 degrees.
     */

    //     return <div style={{perspective: 1000, zIndex:100}}>
    //     <div id="tetrahedron">
    //         <div class="bottom">
    //             <svg height="87px" width="100px">
    //                 <polygon points="0,87 100,87 50,0" style={{fill:'#000'}} />
    //             </svg>
    //         </div>
    //         <div class="left">
    //             <svg height="87px" width="100px">
    //                 <polygon points="0,87 100,87 50,0" style={{fill:'#000'}} />
    //                 <polygon points="38.5,20 62,20 50,0" style={{fill:'#fff'}} />
    //             </svg>
    //         </div>
    //         <div class="right">
    //             <svg height="87px" width="100px">
    //                 <polygon points="0,87 100,87 50,0" style={{fill:'#000'}} />
    //                 <polygon points="38.5,20 62,20 50,0" style={{fill:'#fff'}} />
    //             </svg>
    //         </div>
    //         <div class="back">
    //             <svg height="87px" width="100px">
    //                 <polygon points="0,87 100,87 50,0" sstyle={{fill:'#000'}} />
    //                 <polygon points="38.5,20 62,20 50,0" style={{fill:'#fff'}} />
    //             </svg>
    //         </div>
    //     </div>
    // </div>
}

export default Tetrahedron
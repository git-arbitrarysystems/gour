import { Box } from '@mui/material'

import { useState } from 'react';


const Tetrahedron = props => {

    const [rotation, setRotation] = useState([30, 250, 0])
    const rr = () => {
        setRotation(p => {
            //var i = Math.random() * 100
            const n = Math.random() < 0.5 ? 40 : 0//Math.floor( Math.random() * 40 )
            return [80-n ,-60+n,160-n]
            return p.map((v,i) => {
                return i > 0 ? v + 10*i : v 
            })
        })
    }

    /**
     * roll 1
     * [20,rand,0]
     * [80,-60,160] 
     * 40,-20,120
     * */

    const w = 300,
        h = Math.cos(Math.PI / 6) * w,
        pa = 90 - (Math.acos(1 / 3) / Math.PI) * 180,
        pyramidHeight = Math.sqrt(2 / 3) * w;


    return <Box sx={{ m: 10, width: w, height: w, background: '#fff2' }} onClick={rr}>

        <Box sx={{
            width: w,
            height: w,
            transformOrigin: `${w * 0.5}px ${h * 0.5}px ${-pyramidHeight * 0.5}px`,
            transition: 'transform 0.5s',
            transform: `rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`,
            transformStyle: 'preserve-3d',
            position: 'relative',
        }}>
            {Array(4).fill().map((n, i) => {
                return <Box key={`s${i}`} sx={{
                    width: w,
                    height: h,
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    transformOrigin: ['bottom', 'bottom left', 'bottom right', 'bottom'][i],
                    transform: ['rotateX(90deg)', `rotateY(60deg) rotateX(${-pa}deg)`, `rotateY(-60deg) rotateX(${-pa}deg)`, `rotateX(${pa}deg) rotateY(180deg)`][i],
                    //display: i!=2 ? 'none' : undefined
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
                        { i !== 0 && <rect x={0} y={0} width={w} height={h * 0.25} fill='green' mask="url(#shape)" /> }
                        {
                            i == 0 &&  <polygon
                                points={`0,${h} ${h*0.25},${h} 0,${h - Math.sin(Math.PI/3)*h*0.5}`}
                             fill='green' mask="url(#shape)" />
                        }
                        {
                            i == 1 &&  <polygon
                                points={`0,${h} ${h*0.25},${h} 0,${h - Math.sin(Math.PI/3)*h*0.5}`}
                             fill='green' mask="url(#shape)" />
                        }
                        {
                            i == 3 &&  <polygon
                                points={`${w},${h} ${w-h*0.25},${h} ${w},${h - Math.sin(Math.PI/3)*h*0.5}`}
                             fill='green' mask="url(#shape)" />
                        }
                    </svg>
                </Box>

            })}
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
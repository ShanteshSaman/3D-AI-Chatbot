import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Chat from './Chat.jsx'
import { Box, Typography } from '@mui/material';
import '../avatar.css'


import { ContactShadows, Environment } from '@react-three/drei'
import Businessgirl from './../././../public/Businessgirl.jsx'
import image from './../assets/backimage.jpg'



export default function AvatarViewer() {
    const [speaking, setSpeaking] = useState(false);

    return (
        <>
            <Box sx={{
                height: "7vh", backgroundColor: "#b71c1c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: { xs: "24px", md: "30px" },
                color: "white",
            }}>
                <Typography sx={{ fontSize: 'inherit' }}>
                    Elena
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex', height: '86vh', width: '100%', flexDirection: { xs: 'column', md: 'row' }, backgroundImage: `url(${image})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
                <Box sx={{

                    width: { xs: '100%', md: '50%' },
                    height: { xs: "40%", md: '100%' },

                }}>
                    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>

                        <directionalLight position={[5, 5, 5]} />
                        {/* <spotLight position={[10, 10, 10]} intensity={1} angle={0.15} penumbra={1} /> */}
                        <ambientLight intensity={3} />
                        <OrbitControls />
                        <Businessgirl position={[0, 10, 0]} speaking={speaking} />
                    </Canvas>
                </Box>

                <Box sx={{

                    width: { xs: '100%', md: '50%' },
                    height: { xs: '60%', md: '100%' },
                    overflowY: 'auto',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: "rgba(255,255,255,0.1)"
                }}>
                    <Chat setSpeaking={setSpeaking} />
                </Box>
            </Box>

            <Box sx={{
                height: "7vh", backgroundColor: "#0d47a1", display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                fontSize: { xs: '12px', md: '14px' },
                paddingLeft: { xs: "5px" }
            }}>
                <Typography>
                    @2025 Tech Software Solutions Pvt.Ltd.All rights reserved
                </Typography>
            </Box>

        </>
    );
}






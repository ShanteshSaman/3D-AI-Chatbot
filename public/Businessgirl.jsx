


import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { ClassNames } from '@emotion/react'

export default function Businessgirl({ speaking = false, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/businessgirl.gltf')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)
  console.log(speaking);


  console.log(actions);

  const [currentIndex, setCurrentIndex] = useState(1)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (!actions || names.length === 0) return


    Object.values(actions).forEach((action) => action.stop())

    console.log(speaking);

    if (speaking) {

      actions['talk2_f']?.reset().fadeIn(0.2).play();
      console.log("hi");

    } else {

      actions[names[currentIndex]]?.reset().fadeIn(0.2).play();
    }

    return () => {
      actions[names[currentIndex]]?.fadeOut(0.2).stop()
    }
  }, [currentIndex, actions, names, speaking])




  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {

        setCurrentIndex((prev) => (prev + 1) % names.length)
      }

      if (e.key === 'ArrowLeft') {

        setCurrentIndex((prev) => (prev - 1 + names.length) % names.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [names.length])


  useEffect(() => {
    const hairMat = materials.business01_f_30_hair

    if (hairMat) {
      hairMat.map = null
      hairMat.color.set('black')
      hairMat.needsUpdate = true
    }

  }, [materials])

  useEffect(() => {
    if (materials.business_dress_material) {
      materials.business_dress_material.map = null
      materials.business_dress_material.color.set('#000000')
      materials.business_dress_material.needsUpdate = true
    }
  }, [materials])









  return (
    <group ref={group} {...props} dispose={null} position={isMobile ? [0, -1.2, 0.5] : [0, -1, 0]}
      scale={isMobile ? [0.75, 0.75, 0.75] : [0.63, 0.63, 0.5]}
    >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={1.94}>
          <group name="76e8bca78e2a4d06afd316d1933d3cd8fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="business01_f_highpoly">
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_7" rotation={[-Math.PI / 2, 0, 0]} />
                    <group name="business01_f_highpoly_1" rotation={[-Math.PI / 2, 0, 0]} />
                    <group name="Camera01" position={[-157.376, 99.554, 331.065]} rotation={[-0.009, -0.44, -0.004]} />
                    <group name="Camera01_Target" position={[-3.906, 96.628, 5.41]} rotation={[-Math.PI / 2, 0, 0]} />
                    <skinnedMesh name="Object_8" geometry={nodes.Object_8.geometry} material={materials.business01_f_30} skeleton={nodes.Object_8.skeleton} />
                    <skinnedMesh name="Object_9" geometry={nodes.Object_9.geometry} material={materials.business01_f_30_hair} skeleton={nodes.Object_9.skeleton} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/businessgirl.gltf')



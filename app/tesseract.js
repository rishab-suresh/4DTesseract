'use client';

import { useMemo, useRef } from "react";
import { generateHypercubeVertices } from "./generateHypercube";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Tesseract() {
    const meshRef = useRef();
    const angle = useRef(0);

    const { vertices, edges } = useMemo(() => {
        const vertices = generateHypercubeVertices(4);
        const edges = [];

        for (let i = 0; i < vertices.length; i++) {
            for (let j = 0; j < vertices.length; j++) {
                let diff = 0;
                for (let d = 0; d < 4; d++) {
                    if (vertices[i][d] !== vertices[j][d]) {
                        diff++;
                    }
                }
                if (diff === 1) {
                    edges.push([i, j]);
                }
            }
        }
        return { vertices, edges };


    }, [])

    useFrame(() => {
        angle.current += 0.01;

        const projectedVertices = vertices.map(v => {
            const [x, y, z, w] = v
            const rotationXY = [
                [Math.cos(angle.current), -Math.sin(angle.current)], [Math.sin(angle.current), Math.cos(angle.current)]
            ];
            const rotationZW = [
                [Math.cos(angle.current), -Math.sin(angle.current)], [Math.sin(angle.current), Math.cos(angle.current)]
            ];
            let rotatedX = rotationXY[0][0] * x + rotationXY[0][1] * y;
            let rotatedY = rotationXY[1][0] * x + rotationXY[1][1] * y;
            let rotatedZ = rotationZW[0][0] * z + rotationZW[0][1] * w;
            const distance = 2
            return new THREE.Vector3(rotatedX, rotatedY, rotatedZ).multiplyScalar(distance)
        })


        if (meshRef.current) {
            meshRef.current.geometry.setFromPoints(projectedVertices);
            meshRef.current.geometry.computeBoundingSphere();
        }
    })


    const initialGeometry = new THREE.BufferGeometry().setFromPoints(vertices.map(() => new THREE.Vector3()));
    initialGeometry.setIndex(edges.flat());

    return (
        <lineSegments ref={meshRef} geometry={initialGeometry} >
            <lineBasicMaterial color={"white"} />
        </lineSegments>
    )
}
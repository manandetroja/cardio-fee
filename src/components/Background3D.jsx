import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function NeuralNetwork() {
    const mesh = useRef();
    const count = 1500;

    // Create random positions and connections
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            velocities[i * 3] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        return { positions, velocities };
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        const positions = mesh.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // Boundary wrap around
            if (Math.abs(positions[i * 3]) > 25) {
                positions[i * 3] *= -0.9;
                velocities[i * 3] *= -1;
            }
            if (Math.abs(positions[i * 3 + 1]) > 25) {
                positions[i * 3 + 1] *= -0.9;
                velocities[i * 3 + 1] *= -1;
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y += 0.0005;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#6366f1"
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#020617] pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                style={{ pointerEvents: 'none' }}
                gl={{ alpha: false, antialias: true }}
            >
                <color attach="background" args={['#020617']} />
                <fog attach="fog" args={['#020617', 10, 50]} />
                <ambientLight intensity={0.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <NeuralNetwork />
                <Sparkles count={500} scale={30} size={2} speed={0.4} opacity={0.5} color="#d946ef" />
                <Sparkles count={200} scale={20} size={5} speed={0.2} opacity={0.2} color="#0ea5e9" />
            </Canvas>
        </div>
    );
}

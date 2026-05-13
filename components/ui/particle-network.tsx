"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"

interface ParticleNetworkProps {
    particleCount?: number
    minDistance?: number
    maxConnections?: number
    color?: string
    speed?: number
    className?: string
}

export function ParticleNetwork({
    particleCount = 160,
    minDistance = 120,
    maxConnections = 10,
    color = "#DCF763",
    speed = 0.2,
    className,
}: ParticleNetworkProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const threeColor = new THREE.Color(color)

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(renderer.domElement)

        // Scene + camera
        const scene = new THREE.Scene()
        const fov = 50
        const camera = new THREE.PerspectiveCamera(
            fov,
            container.clientWidth / container.clientHeight,
            1,
            4000,
        )
        camera.position.z = 1500

        // Compute frustum-visible bounds at z=0 so particles fill the viewport
        function visibleBounds() {
            const vFov = (fov * Math.PI) / 180
            const h = 2 * Math.tan(vFov / 2) * camera.position.z
            const w = h * (container!.clientWidth / container!.clientHeight)
            return { w, h }
        }

        let { w: boundsW, h: boundsH } = visibleBounds()
        const boundsD = 300 // shallow depth so the effect looks flat-ish
        const halfW = () => boundsW / 2
        const halfH = () => boundsH / 2
        const halfD = boundsD / 2

        // Group with slow rotation
        const group = new THREE.Group()
        scene.add(group)

        // Particle data
        const maxParticles = particleCount
        const segments = maxParticles * maxParticles

        const particlePositions = new Float32Array(maxParticles * 3)
        const particlesData: { vx: number; vy: number; vz: number; connections: number }[] = []

        for (let i = 0; i < maxParticles; i++) {
            particlePositions[i * 3] = Math.random() * boundsW - boundsW / 2
            particlePositions[i * 3 + 1] = Math.random() * boundsH - boundsH / 2
            particlePositions[i * 3 + 2] = Math.random() * boundsD - halfD
            particlesData.push({
                vx: (Math.random() - 0.5) * speed * 2,
                vy: (Math.random() - 0.5) * speed * 2,
                vz: (Math.random() - 0.5) * speed * 0.5,
                connections: 0,
            })
        }

        // Points geometry
        const pointsGeo = new THREE.BufferGeometry()
        pointsGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage),
        )
        pointsGeo.setDrawRange(0, maxParticles)

        const pointsMat = new THREE.PointsMaterial({
            color: threeColor,
            size: 2.5,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: false,
        })
        group.add(new THREE.Points(pointsGeo, pointsMat))

        // Lines geometry
        const linePositions = new Float32Array(segments * 3 * 2)
        const lineColors = new Float32Array(segments * 3 * 2)

        const linesGeo = new THREE.BufferGeometry()
        linesGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage),
        )
        linesGeo.setAttribute(
            "color",
            new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage),
        )
        linesGeo.computeBoundingSphere()
        linesGeo.setDrawRange(0, 0)

        const linesMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
        })
        const linesMesh = new THREE.LineSegments(linesGeo, linesMat)
        group.add(linesMesh)

        // Resize handler
        function onResize() {
            if (!container) return
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
            const bounds = visibleBounds()
            boundsW = bounds.w
            boundsH = bounds.h
        }
        window.addEventListener("resize", onResize)

        // Animation
        let animId: number

        function animate() {
            animId = requestAnimationFrame(animate)

            const hw = halfW()
            const hh = halfH()

            let vertexPos = 0
            let colorPos = 0
            let numConnected = 0

            for (let i = 0; i < maxParticles; i++) {
                particlesData[i].connections = 0
            }

            for (let i = 0; i < maxParticles; i++) {
                const pd = particlesData[i]
                const ix = i * 3
                const iy = ix + 1
                const iz = ix + 2

                particlePositions[ix] += pd.vx
                particlePositions[iy] += pd.vy
                particlePositions[iz] += pd.vz

                if (particlePositions[ix] < -hw || particlePositions[ix] > hw) pd.vx = -pd.vx
                if (particlePositions[iy] < -hh || particlePositions[iy] > hh) pd.vy = -pd.vy
                if (particlePositions[iz] < -halfD || particlePositions[iz] > halfD) pd.vz = -pd.vz

                if (pd.connections >= maxConnections) continue

                for (let j = i + 1; j < maxParticles; j++) {
                    const pdB = particlesData[j]
                    if (pdB.connections >= maxConnections) continue

                    const jx = j * 3
                    const dx = particlePositions[ix] - particlePositions[jx]
                    const dy = particlePositions[iy] - particlePositions[jx + 1]
                    const dz = particlePositions[iz] - particlePositions[jx + 2]
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

                    if (dist < minDistance) {
                        pd.connections++
                        pdB.connections++

                        const alpha = 1.0 - dist / minDistance

                        linePositions[vertexPos++] = particlePositions[ix]
                        linePositions[vertexPos++] = particlePositions[iy]
                        linePositions[vertexPos++] = particlePositions[iz]

                        linePositions[vertexPos++] = particlePositions[jx]
                        linePositions[vertexPos++] = particlePositions[jx + 1]
                        linePositions[vertexPos++] = particlePositions[jx + 2]

                        const r = threeColor.r * alpha
                        const g = threeColor.g * alpha
                        const b = threeColor.b * alpha

                        lineColors[colorPos++] = r
                        lineColors[colorPos++] = g
                        lineColors[colorPos++] = b
                        lineColors[colorPos++] = r
                        lineColors[colorPos++] = g
                        lineColors[colorPos++] = b

                        numConnected++
                    }
                }
            }

            linesMesh.geometry.setDrawRange(0, numConnected * 2)
            linesMesh.geometry.attributes.position.needsUpdate = true
            linesMesh.geometry.attributes.color.needsUpdate = true
            pointsGeo.attributes.position.needsUpdate = true

            const time = Date.now() * 0.00002
            group.rotation.y = time * 0.5
            group.rotation.x = time * 0.2

            renderer.render(scene, camera)
        }

        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener("resize", onResize)
            renderer.dispose()
            pointsGeo.dispose()
            pointsMat.dispose()
            linesGeo.dispose()
            linesMat.dispose()
            container.removeChild(renderer.domElement)
        }
    }, [particleCount, minDistance, maxConnections, color, speed])

    return (
        <div
            ref={containerRef}
            aria-hidden
            className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
        />
    )
}

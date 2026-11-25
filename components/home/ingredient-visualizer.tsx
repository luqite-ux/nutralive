'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MoveHorizontal, RotateCcw, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/site/section-heading'
import { Reveal } from '@/components/site/reveal'
import { IMG, CONTAINER } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { ModeId } from '@/lib/three-scenes'

type Mode = {
  id: ModeId
  label: string
  title: string
  description: string
  specs: { k: string; v: string }[]
  href: string
  fallback: string
}

const MODES: Mode[] = [
  {
    id: 'botanical',
    label: 'Extract Micro-Powder',
    title: 'Botanical Extract Micro-Powder & Phytochemical Structure',
    description:
      'Standardized botanical extracts are milled to a fine, free-flowing powder and assayed by HPLC. The schematic above the dish represents a curcuminoid-type phytochemical backbone.',
    specs: [
      { k: 'Example items', v: 'Turmeric Curcumin 95%, Berberine HCl 97%' },
      { k: 'Assay method', v: 'HPLC against reference standards' },
      { k: 'Form', v: 'Fine powder, 25 kg fiber drum' },
      { k: 'Documents', v: 'COA and SPEC per lot' },
    ],
    href: '/products?category=herbal-extracts',
    fallback: IMG.turmeric,
  },
  {
    id: 'amino',
    label: 'Amino Acid Granules',
    title: 'Instantized Amino Acid Granules',
    description:
      'Granulated amino acids and blends designed for easier dispersion in sports nutrition powders, stick packs and ready-to-mix formulas.',
    specs: [
      { k: 'Example items', v: 'L-Isoleucine USP and BCAA-type blends' },
      { k: 'Processing', v: 'Granulation and premix blending' },
      { k: 'Custom batches', v: 'From 500 kg' },
      { k: 'Typical use', v: 'Sports nutrition, powders, tablets' },
    ],
    href: '/products?category=amino-acids',
    fallback: IMG.banner3,
  },
  {
    id: 'oils',
    label: 'Tocopherol & DHA Oils',
    title: 'Natural Tocopherol & Algae DHA Oil Droplets',
    description:
      'Viscous natural-source oils for softgels, capsules and fortified formulations, supplied in amber, food-grade appearance and traceable lots.',
    specs: [
      { k: 'Example items', v: 'Mixed Tocopherols T70/T90, Algae DHA Oil 40%' },
      { k: 'Form', v: 'Oil / liquid concentrate' },
      { k: 'Sample formats', v: 'NutraLive-labelled bottles' },
      { k: 'Typical use', v: 'Softgels, antioxidant systems, infant and adult nutrition' },
    ],
    href: '/products?category=functional-ingredients',
    fallback: IMG.tocopherol,
  },
  {
    id: 'oem',
    label: 'Tablets & Capsules',
    title: 'OEM Herbal Tablets & Two-Piece Hard Capsules',
    description:
      'Finished dosage forms made from your formula: herbal extract tableting and two-piece hard capsule filling for private-label supplement brands.',
    specs: [
      { k: 'Services', v: 'Tableting and hard capsule filling' },
      { k: 'OEM batches', v: 'From 500 kg' },
      { k: 'Inputs', v: 'Your formula or NutraLive extracts' },
      { k: 'Packaging', v: 'Bottles, foil pouches, bulk' },
    ],
    href: '/custom-processing',
    fallback: IMG.banner3,
  },
]

type Runtime = {
  setMode: (id: ModeId) => void
  nudge: (delta: number) => void
  dispose: () => void
}

export function IngredientVisualizer() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<Runtime | null>(null)
  const modeRef = useRef<ModeId>('botanical')
  const [mode, setMode] = useState<ModeId>('botanical')
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const host = canvasHostRef.current
    const wrap = wrapRef.current
    if (!host || !wrap) return
    let cancelled = false
    let cleanup: (() => void) | undefined

    ;(async () => {
      try {
        const THREE = await import('three')
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
        const { BUILDERS } = await import('@/lib/three-scenes')
        if (cancelled) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05
        renderer.domElement.className = 'size-full block'
        host.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
        scene.environment = envTex
        scene.environmentIntensity = 0.9

        const key = new THREE.DirectionalLight(0xffffff, 1.6)
        key.position.set(3, 5, 4)
        scene.add(key)
        scene.add(new THREE.HemisphereLight(0xf4f8f2, 0xdce6d8, 0.9))

        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
        camera.position.set(0, 3.1, 7.4)
        camera.lookAt(0, 0.7, 0)

        const shadowCanvas = document.createElement('canvas')
        shadowCanvas.width = shadowCanvas.height = 128
        const sctx = shadowCanvas.getContext('2d')!
        const grad = sctx.createRadialGradient(64, 64, 6, 64, 64, 62)
        grad.addColorStop(0, 'rgba(22,54,26,0.22)')
        grad.addColorStop(1, 'rgba(22,54,26,0)')
        sctx.fillStyle = grad
        sctx.fillRect(0, 0, 128, 128)
        const shadowTex = new THREE.CanvasTexture(shadowCanvas)
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(6.2, 6.2),
          new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
        )
        shadow.rotation.x = -Math.PI / 2
        shadow.position.y = -0.12
        scene.add(shadow)

        const pivot = new THREE.Group()
        scene.add(pivot)

        let current: ReturnType<(typeof BUILDERS)[ModeId]> | null = null
        let appear = 1
        let yaw = 0.5
        let velocity = 0
        let time = 0
        let visible = true
        let raf = 0
        let last = performance.now()

        const render = () => renderer.render(scene, camera)

        const load = (id: ModeId) => {
          if (current) {
            pivot.remove(current.group)
            current.dispose()
          }
          current = BUILDERS[id]()
          pivot.add(current.group)
          appear = reduceMotion ? 1 : 0
          current.group.scale.setScalar(reduceMotion ? 1 : 0.001)
          if (reduceMotion) {
            current.tick?.(0)
            render()
          }
        }

        const frame = (now: number) => {
          raf = 0
          if (!visible || document.hidden) return
          const dt = Math.min((now - last) / 1000, 0.05)
          last = now
          time += dt
          yaw += velocity * dt
          velocity *= 0.94
          if (!dragActive) yaw += dt * 0.18
          appear = Math.min(1, appear + dt * 3)
          const ease = 1 - Math.pow(1 - appear, 3)
          if (current) {
            current.group.scale.setScalar(Math.max(ease, 0.001))
            current.tick?.(time)
          }
          pivot.rotation.y = yaw
          pivot.position.y = Math.sin(time * 0.8) * 0.06
          render()
          raf = requestAnimationFrame(frame)
        }
        const start = () => {
          if (reduceMotion || raf) return
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
        const stop = () => {
          if (raf) cancelAnimationFrame(raf)
          raf = 0
        }

        let dragActive = false
        let lastX = 0
        const el = renderer.domElement
        el.style.touchAction = 'pan-y'
        const down = (e: PointerEvent) => {
          dragActive = true
          lastX = e.clientX
          velocity = 0
          el.setPointerCapture(e.pointerId)
          setDragging(true)
        }
        const move = (e: PointerEvent) => {
          if (!dragActive) return
          const dx = e.clientX - lastX
          lastX = e.clientX
          yaw += dx * 0.011
          velocity = dx * 0.011 * 60
          if (reduceMotion) {
            pivot.rotation.y = yaw
            render()
          }
        }
        const up = (e: PointerEvent) => {
          dragActive = false
          if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
          setDragging(false)
          if (reduceMotion) velocity = 0
        }
        el.addEventListener('pointerdown', down)
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerup', up)
        el.addEventListener('pointercancel', up)

        const resize = () => {
          const w = host.clientWidth
          const h = host.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          if (reduceMotion || !raf) render()
        }
        const ro = new ResizeObserver(resize)
        ro.observe(host)

        const io = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
            else stop()
          },
          { threshold: 0.05 },
        )
        io.observe(wrap)
        const onVis = () => (document.hidden ? stop() : visible && start())
        document.addEventListener('visibilitychange', onVis)

        load(modeRef.current)
        resize()
        setReady(true)

        runtimeRef.current = {
          setMode: load,
          nudge: (delta) => {
            velocity = 0
            yaw += delta
            if (reduceMotion) {
              pivot.rotation.y = yaw
              render()
            }
          },
          dispose: () => undefined,
        }

        cleanup = () => {
          stop()
          io.disconnect()
          ro.disconnect()
          document.removeEventListener('visibilitychange', onVis)
          el.removeEventListener('pointerdown', down)
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerup', up)
          el.removeEventListener('pointercancel', up)
          if (current) current.dispose()
          shadowTex.dispose()
          shadow.geometry.dispose()
          ;(shadow.material as import('three').Material).dispose()
          envTex.dispose()
          pmrem.dispose()
          renderer.dispose()
          renderer.domElement.remove()
          runtimeRef.current = null
        }
        if (cancelled) cleanup()
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  const selectMode = useCallback((id: ModeId) => {
    modeRef.current = id
    setMode(id)
    runtimeRef.current?.setMode(id)
  }, [])

  const active = MODES.find((m) => m.id === mode) ?? MODES[0]

  return (
    <section id="threejs-visualizer" aria-label="Interactive 3D ingredient and dosage form visualizer" className="bg-white py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeading
            eyebrow="Interactive 3D"
            title="Ingredient & Dosage Form Visualizer"
            description="Drag to rotate each NutraLive format in 360°. Switch between extract powders, amino acid granules, natural oils and finished tablets and capsules."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div
              ref={wrapRef}
              className="relative overflow-hidden rounded-3xl border border-sage bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,#F4F8F2_55%,#E7EFE2_100%)]"
            >
              <div
                ref={canvasHostRef}
                role="img"
                aria-label={`Interactive 3D model: ${active.title}. Drag horizontally to rotate.`}
                className={cn(
                  'aspect-[4/3] w-full select-none',
                  dragging ? 'cursor-grabbing' : 'cursor-grab',
                  failed && 'hidden',
                )}
              />
              {failed && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.fallback || '/placeholder.svg'}
                  alt={active.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              {!ready && !failed && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  Loading 3D model…
                </div>
              )}

              {!failed && (
                <>
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-sage bg-white/90 px-3 py-1.5 text-xs font-medium text-forest">
                    <MoveHorizontal className="size-3.5" aria-hidden="true" /> Drag to rotate
                  </span>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-9 bg-white/90"
                      aria-label="Rotate left"
                      onClick={() => runtimeRef.current?.nudge(-0.6)}
                    >
                      <RotateCcw />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-9 bg-white/90"
                      aria-label="Rotate right"
                      onClick={() => runtimeRef.current?.nudge(0.6)}
                    >
                      <RotateCw />
                    </Button>
                  </div>
                </>
              )}
              <p className="pointer-events-none absolute bottom-4 left-4 max-w-[55%] text-[11px] leading-tight text-muted-foreground">
                Illustrative model, not to scale.
              </p>
            </div>

            <div className="flex flex-col rounded-3xl border border-sage bg-cream p-6 lg:p-8">
              <div role="tablist" aria-label="Select format" className="grid grid-cols-2 gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    id={`tab-${m.id}`}
                    aria-selected={mode === m.id}
                    aria-controls="visualizer-panel"
                    onClick={() => selectMode(m.id)}
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-leaf',
                      mode === m.id
                        ? 'border-forest bg-forest text-white'
                        : 'border-sage bg-white text-forest-deep hover:border-leaf',
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div id="visualizer-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="mt-6 flex-1">
                <h3 className="font-display text-2xl font-semibold leading-snug text-forest-deep">{active.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
                <dl className="mt-5 divide-y divide-sage rounded-xl border border-sage bg-white text-sm">
                  {active.specs.map((s) => (
                    <div key={s.k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5">
                      <dt className="text-muted-foreground">{s.k}</dt>
                      <dd className="font-medium text-forest-deep">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-forest hover:bg-forest-deep">
                  <Link href={active.href}>
                    Explore range <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-forest text-forest">
                  <Link href="/contact#rfq">Request a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from "postprocessing"

const Hyperspeed = ({
  effectOptions = {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3,
    },
  },
}) => {
  const hyperspeed = useRef(null)
  const appRef = useRef(null)

  useEffect(() => {
    if (appRef.current) {
      appRef.current.dispose()
      const container = document.getElementById("lights")
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
    }

    const turbulentUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
    }

    const nsin = (val) => Math.sin(val) * 0.5 + 0.5

    const distortions = {
      turbulentDistortion: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r + uTime) * uAmp.r +
              pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.0125),
              getDistortionY(progress) - getDistortionY(0.0125),
              0.
            );
          }
        `,
        getJS: (progress, time) => {
          const uFreq = turbulentUniforms.uFreq.value
          const uAmp = turbulentUniforms.uAmp.value

          const getX = (p) =>
            Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
            Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y

          const getY = (p) =>
            -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
            Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w

          const distortion = new THREE.Vector3(
            getX(progress) - getX(progress + 0.007),
            getY(progress) - getY(progress + 0.007),
            0,
          )
          const lookAtAmp = new THREE.Vector3(-2, -5, 0)
          const lookAtOffset = new THREE.Vector3(0, 0, -10)
          return distortion.multiply(lookAtAmp).add(lookAtOffset)
        },
      },
    }

    class App {
      constructor(container, options = {}) {
        this.options = options
        this.options.distortion = distortions[options.distortion] || distortions.turbulentDistortion

        this.container = container
        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
        })
        this.renderer.setSize(container.offsetWidth, container.offsetHeight, false)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.composer = new EffectComposer(this.renderer)
        container.append(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(
          options.fov,
          container.offsetWidth / container.offsetHeight,
          0.1,
          10000,
        )
        this.camera.position.z = -5
        this.camera.position.y = 8
        this.camera.position.x = 0
        this.scene = new THREE.Scene()
        this.scene.background = null

        const fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500)
        this.scene.fog = fog
        this.fogUniforms = {
          fogColor: { value: fog.color },
          fogNear: { value: fog.near },
          fogFar: { value: fog.far },
        }
        this.clock = new THREE.Clock()
        this.disposed = false

        this.road = new Road(this, options)
        this.leftCarLights = new CarLights(
          this,
          options,
          options.colors.leftCars,
          options.movingAwaySpeed,
          new THREE.Vector2(0, 1 - options.carLightsFade),
        )
        this.rightCarLights = new CarLights(
          this,
          options,
          options.colors.rightCars,
          options.movingCloserSpeed,
          new THREE.Vector2(1, 0 + options.carLightsFade),
        )

        this.fovTarget = options.fov
        this.speedUpTarget = 0
        this.speedUp = 0
        this.timeOffset = 0

        this.tick = this.tick.bind(this)
        this.init = this.init.bind(this)
        this.setSize = this.setSize.bind(this)

        window.addEventListener("resize", this.onWindowResize.bind(this))
      }

      onWindowResize() {
        const width = this.container.offsetWidth
        const height = this.container.offsetHeight

        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.composer.setSize(width, height)
      }

      initPasses() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.bloomPass = new EffectPass(
          this.camera,
          new BloomEffect({
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            resolutionScale: 0.8,
          }),
        )

        const smaaPass = new EffectPass(
          this.camera,
          new SMAAEffect({
            preset: SMAAPreset.LOW,
          }),
        )
        this.renderPass.renderToScreen = false
        this.bloomPass.renderToScreen = false
        smaaPass.renderToScreen = true
        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.bloomPass)
        this.composer.addPass(smaaPass)
      }

      init() {
        this.initPasses()
        const options = this.options
        this.road.init()
        this.leftCarLights.init()
        this.leftCarLights.mesh.position.setX(-options.roadWidth / 2 - options.islandWidth / 2)
        this.rightCarLights.init()
        this.rightCarLights.mesh.position.setX(options.roadWidth / 2 + options.islandWidth / 2)
        this.tick()
      }

      update(delta) {
        const time = this.clock.elapsedTime + this.timeOffset
        this.rightCarLights.update(time)
        this.leftCarLights.update(time)
        this.road.update(time)

        if (this.options.distortion.getJS) {
          const distortion = this.options.distortion.getJS(0.025, time)
          this.camera.lookAt(
            new THREE.Vector3(
              this.camera.position.x + distortion.x,
              this.camera.position.y + distortion.y,
              this.camera.position.z + distortion.z,
            ),
          )
          this.camera.updateProjectionMatrix()
        }
      }

      render(delta) {
        this.composer.render(delta)
      }

      dispose() {
        this.disposed = true
        if (this.renderer) {
          this.renderer.dispose()
        }
        if (this.composer) {
          this.composer.dispose()
        }
        if (this.scene) {
          this.scene.clear()
        }
        window.removeEventListener("resize", this.onWindowResize.bind(this))
      }

      setSize(width, height, updateStyles) {
        this.composer.setSize(width, height, updateStyles)
      }

      tick() {
        if (this.disposed || !this) return
        if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
          const canvas = this.renderer.domElement
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight
          this.camera.updateProjectionMatrix()
        }
        const delta = this.clock.getDelta()
        this.render(delta)
        this.update(delta)
        requestAnimationFrame(this.tick)
      }
    }

    const random = (base) => {
      if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0]
      return Math.random() * base
    }

    const pickRandom = (arr) => {
      if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)]
      return arr
    }

    class CarLights {
      constructor(webgl, options, colors, speed, fade) {
        this.webgl = webgl
        this.options = options
        this.colors = colors
        this.speed = speed
        this.fade = fade
      }

      init() {
        const options = this.options
        const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1))
        const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false)

        const instanced = new THREE.InstancedBufferGeometry().copy(geometry)
        instanced.instanceCount = options.lightPairsPerRoadWay * 2

        const laneWidth = options.roadWidth / options.lanesPerRoad
        const aOffset = []
        const aMetrics = []
        const aColor = []

        let colors = this.colors
        if (Array.isArray(colors)) {
          colors = colors.map((c) => new THREE.Color(c))
        } else {
          colors = new THREE.Color(colors)
        }

        for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
          const radius = random(options.carLightsRadius)
          const length = random(options.carLightsLength)
          const speed = random(this.speed)

          const carLane = i % options.lanesPerRoad
          let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2
          const carWidth = random(options.carWidthPercentage) * laneWidth
          const carShiftX = random(options.carShiftX) * laneWidth
          laneX += carShiftX

          const offsetY = random(options.carFloorSeparation) + radius * 1.3
          const offsetZ = -random(options.length)

          aOffset.push(laneX - carWidth / 2, offsetY, offsetZ)
          aOffset.push(laneX + carWidth / 2, offsetY, offsetZ)

          aMetrics.push(radius, length, speed)
          aMetrics.push(radius, length, speed)

          const color = pickRandom(colors)
          aColor.push(color.r, color.g, color.b)
          aColor.push(color.r, color.g, color.b)
        }

        instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false))
        instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false))
        instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false))

        const material = new THREE.ShaderMaterial({
          fragmentShader: carLightsFragment,
          vertexShader: carLightsVertex,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uFade: { value: this.fade },
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms,
          ),
        })

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            "#include <getDistortion_vertex>",
            options.distortion.getDistortion,
          )
        }

        const mesh = new THREE.Mesh(instanced, material)
        mesh.frustumCulled = false
        this.webgl.scene.add(mesh)
        this.mesh = mesh
      }

      update(time) {
        this.mesh.material.uniforms.uTime.value = time
      }
    }

    const carLightsFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_fragment"]}
      varying vec3 vColor;
      varying vec2 vUv; 
      uniform vec2 uFade;
      void main() {
        vec3 color = vec3(vColor);
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${THREE.ShaderChunk["fog_fragment"]}
      }
    `

    const carLightsVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_vertex"]}
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv; 
      varying vec3 vColor; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;

        transformed.xy *= radius;
        transformed.z *= myLength;
        transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
        transformed.xy += aOffset.xy;

        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vColor = aColor;
        ${THREE.ShaderChunk["fog_vertex"]}
      }
    `

    class Road {
      constructor(webgl, options) {
        this.webgl = webgl
        this.options = options
        this.uTime = { value: 0 }
      }

      createPlane(side, width, isRoad) {
        const options = this.options
        const geometry = new THREE.PlaneGeometry(
          isRoad ? options.roadWidth : options.islandWidth,
          options.length,
          20,
          100,
        )

        const uniforms = {
          uTravelLength: { value: options.length },
          uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) },
          uTime: this.uTime,
        }

        const material = new THREE.ShaderMaterial({
          fragmentShader: roadFragment,
          vertexShader: roadVertex,
          side: THREE.DoubleSide,
          uniforms: Object.assign(uniforms, this.webgl.fogUniforms, options.distortion.uniforms),
        })

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            "#include <getDistortion_vertex>",
            options.distortion.getDistortion,
          )
        }

        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = -Math.PI / 2
        mesh.position.z = -options.length / 2
        mesh.position.x += (this.options.islandWidth / 2 + options.roadWidth / 2) * side
        this.webgl.scene.add(mesh)

        return mesh
      }

      init() {
        this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true)
        this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true)
        this.island = this.createPlane(0, this.options.islandWidth, false)
      }

      update(time) {
        this.uTime.value = time
      }
    }

    const roadFragment = `
      #define USE_FOG;
      varying vec2 vUv; 
      uniform vec3 uColor;
      uniform float uTime;
      ${THREE.ShaderChunk["fog_pars_fragment"]}
      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(uColor);
        gl_FragColor = vec4(color, 1.);
        ${THREE.ShaderChunk["fog_fragment"]}
      }
    `

    const roadVertex = `
      #define USE_FOG;
      uniform float uTime;
      ${THREE.ShaderChunk["fog_pars_vertex"]}
      uniform float uTravelLength;
      varying vec2 vUv; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
        transformed.x += distortion.x;
        transformed.z += distortion.y;
        transformed.y += -1. * distortion.z;  
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        ${THREE.ShaderChunk["fog_vertex"]}
      }
    `

    function resizeRendererToDisplaySize(renderer, setSize) {
      const canvas = renderer.domElement
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const needResize = canvas.width !== width || canvas.height !== height
      if (needResize) {
        setSize(width, height, false)
      }
      return needResize
    }

    const container = document.getElementById("lights")
    if (container) {
      const options = { ...effectOptions }
      const myApp = new App(container, options)
      appRef.current = myApp
      myApp.init()
    }

    return () => {
      if (appRef.current) {
        appRef.current.dispose()
      }
    }
  }, [effectOptions])

  return <div id="lights" ref={hyperspeed}></div>
}

export default Hyperspeed

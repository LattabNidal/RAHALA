import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Compass, RotateCw, Eye, Sparkles, BookOpen, Volume2, Info, 
  Bookmark, Sun, Moon, Database, HelpCircle, RefreshCw, 
  Layers, MapPin, Maximize2 
} from 'lucide-react';
import { mockLandmarks } from '../data/mockData';
import { Landmark } from '../types';

// Track coordinates of hotspots in 3D scene to auto-focus them
const hotspotsData: { [key: string]: { name: string; pos: THREE.Vector3; info: string }[] } = {
  casbah: [
    { name: 'Ketchaoua Ottoman Columns', pos: new THREE.Vector3(-3.5, 1.5, 1.5), info: 'Dating back to the Ottoman Empire, combining Byzantine and Moorish engineering standards.' },
    { name: 'Traditional Glazed Dome', pos: new THREE.Vector3(0, 5.5, 0), info: 'Iconic green glazed hemispherical dome crowning Ottoman residential quarters.' },
    { name: 'Wooden Mashrabiya', pos: new THREE.Vector3(0, 3, 1.6), info: 'Detailed cedar lattice panels allowing fresh sea breezes while maintaining absolute privacy.' }
  ],
  'santa-cruz': [
    { name: 'Spanish Bastions', pos: new THREE.Vector3(-4, 1.5, 2), info: 'Heavily reinforced thick stone battlements designed by Spanish engineers in the 16th century.' },
    { name: 'Bell Chapel Tower', pos: new THREE.Vector3(3.5, 4.5, -2), info: 'Dedicated to Notre Dame de Santa Cruz, honoring the historical epidemic relief.' },
    { name: 'Corner Watchtower Gaze', pos: new THREE.Vector3(-3, 3, -1.5), info: 'Strategic overhanging stone guerite offering panoramic surveillance of the harbor.' }
  ],
  tassili: [
    { name: 'La Vache Qui Pleure Carving', pos: new THREE.Vector3(-3.5, 2, 0.5), info: 'Neolithic sandstone masterpiece depicting weeping cattle, proving ancient Sahara was once green.' },
    { name: 'Melodic Sandstone Vent', pos: new THREE.Vector3(0, 4.5, 0), info: 'Natural wind-hollowed sandstone flute passage that whistles during desert sandstorms.' },
    { name: 'Prehistoric Dune Base', pos: new THREE.Vector3(3, -1.8, 3), info: 'Silt and quartz sand sediments formed over 10,000 years of Aeolian desert erosion.' }
  ],
  'constantine-bridges': [
    { name: 'Sidi M’Cid Suspension Pylons', pos: new THREE.Vector3(-4.5, 3.5, 0), info: 'Majestic steel frame towers constructed by renowned French engineer Ferdinand Arnodin in 1912.' },
    { name: 'Rhumel River Gorge', pos: new THREE.Vector3(0, -5, 0), info: 'Deep limestone canyon carved by mountain rivers, acting as an impregnable fortress moat.' },
    { name: 'Steel Wire Cables', pos: new THREE.Vector3(0, 1.8, 0), info: 'High-tensile steel cord suspension lines holding the deck suspended 175 meters in the air.' }
  ],
  timgad: [
    { name: 'Roman Arch Plaque', pos: new THREE.Vector3(0, 5, 1.1), info: 'Sandstone engraved attic dedicating the triumphal gateway to Emperor Trajan (AD 100).' },
    { name: 'Corinthian Fluted Capitals', pos: new THREE.Vector3(-3, 3.2, 1.5), info: 'Classical Roman columns made of high-grade fossilized Aurean limestone.' },
    { name: 'Decumanus Maximus paved road', pos: new THREE.Vector3(2, -2, 4), info: 'Symmetric grid-iron stone chariot tracks perfectly aligned with the Roman forum.' }
  ]
};

// Let's create a dedicated Interactive 3D Monument component using pure WebGL Three.js
interface Monument3DViewerProps {
  landmarkId: string;
  isPremium: boolean;
  language: string;
  onHotspotSelect: (info: { name: string; info: string }) => void;
  selectedHotspotName: string | null;
  lightPreset: 'day' | 'sunset' | 'midnight';
  showWireframe: boolean;
}

const Monument3DViewer: React.FC<Monument3DViewerProps> = ({
  landmarkId,
  isPremium,
  language,
  onHotspotSelect,
  selectedHotspotName,
  lightPreset,
  showWireframe
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep track of user rotation/interaction variables via refs for fluid animation loop
  const interactionRef = useRef({
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    theta: Math.PI / 4, // Horizontal orbit angle
    phi: Math.PI / 3,   // Vertical elevation orbit angle
    radius: 17,         // Distance from center
    targetTheta: Math.PI / 4,
    targetPhi: Math.PI / 3,
    targetRadius: 17,
    autoRotate: true
  });

  // Trigger camera flight to selected hotspot
  useEffect(() => {
    if (selectedHotspotName) {
      const currentList = hotspotsData[landmarkId] || [];
      const spot = currentList.find(s => s.name === selectedHotspotName);
      if (spot) {
        // Calculate spherical angles for this position to fly the camera
        const targetPos = spot.pos;
        const dx = targetPos.x;
        const dy = targetPos.y + 1; // Look slightly from above
        const dz = targetPos.z;
        
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz) + 5; // offset radial
        const horizontalAngle = Math.atan2(dx, dz);
        const verticalAngle = Math.acos(dy / Math.max(0.1, distance));

        interactionRef.current.targetTheta = horizontalAngle;
        interactionRef.current.targetPhi = THREE.MathUtils.clamp(verticalAngle, 0.1, Math.PI / 2.1);
        interactionRef.current.targetRadius = Math.max(8, Math.min(distance, 15));
        interactionRef.current.autoRotate = false; // Disable auto spin upon selection
      }
    }
  }, [selectedHotspotName, landmarkId]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Get original container dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    
    // Set sky / ambient environment colors depending on the selected lighting preset
    let skyBgColor = 0x050811;
    let starDensity = 250;
    
    if (lightPreset === 'day') {
      skyBgColor = 0xbce0fd; // Oasis clear sky
      scene.background = new THREE.Color(skyBgColor);
      scene.fog = new THREE.FogExp2(0xd6eaff, 0.015);
    } else if (lightPreset === 'sunset') {
      skyBgColor = 0x3d1a11; // Sunset twilight glow
      scene.background = new THREE.Color(skyBgColor);
      scene.fog = new THREE.FogExp2(0xf78e69, 0.02);
    } else {
      skyBgColor = 0x030308; // Sahara deep blue void
      scene.background = new THREE.Color(skyBgColor);
      scene.fog = new THREE.FogExp2(0x0a0c18, 0.01);
    }

    // 2. Initialize Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 10, 12);

    // 3. Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // 4. Create Ambient Star Ambient points
    if (lightPreset === 'midnight' || lightPreset === 'sunset') {
      const starGeo = new THREE.BufferGeometry();
      const starCoords = [];
      for (let i = 0; i < starDensity; i++) {
        const x = (Math.random() - 0.5) * 80;
        const y = Math.random() * 40 + 5; // strictly above ground
        const z = (Math.random() - 0.5) * 80;
        starCoords.push(x, y, z);
      }
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
      const starMat = new THREE.PointsMaterial({
        color: lightPreset === 'sunset' ? 0xffddaa : 0xffffff,
        size: 0.18,
        transparent: true,
        opacity: 0.85
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
    }

    // 5. Add Lights System
    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight();
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    const d = 15;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Adjust light properties based on Preset
    if (lightPreset === 'day') {
      ambientLight.color.setHex(0x556677);
      ambientLight.intensity = 1.2;
      sunLight.color.setHex(0xfffaed);
      sunLight.intensity = 1.8;
      sunLight.position.set(12, 18, 8);
    } else if (lightPreset === 'sunset') {
      ambientLight.color.setHex(0x332222);
      ambientLight.intensity = 0.8;
      sunLight.color.setHex(0xfc6a3f);
      sunLight.intensity = 1.6;
      sunLight.position.set(15, 6, 2);
    } else {
      ambientLight.color.setHex(0x1a223a);
      ambientLight.intensity = 0.4;
      sunLight.color.setHex(0xa9bfff);
      sunLight.intensity = 0.7;
      sunLight.position.set(-10, 15, -10);
    }

    // Material generator helper handling wireframe mode
    const getMat = (config: THREE.MeshStandardMaterialParameters) => {
      return new THREE.MeshStandardMaterial({
        ...config,
        wireframe: showWireframe,
        roughness: config.roughness ?? 0.6,
        metalness: config.metalness ?? 0.1
      });
    };

    // Concrete 3D mesh building logic for each historical monument
    const monumentGroup = new THREE.Group();

    // Floor Base podium
    if (landmarkId === 'tassili') {
      // Deformed heights for Saharan sand dunes
      const duneGeo = new THREE.PlaneGeometry(32, 32, 40, 40);
      duneGeo.rotateX(-Math.PI / 2);
      const pos = duneGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // sand dune mathematical wave
        const y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.5 + Math.sin(z * 0.15) * 1.0;
        pos.setY(i, y - 1);
      }
      duneGeo.computeVertexNormals();
      const duneMat = getMat({ color: 0xdca265, roughness: 0.9, metalness: 0.05 });
      const dunes = new THREE.Mesh(duneGeo, duneMat);
      dunes.receiveShadow = true;
      monumentGroup.add(dunes);
    } else if (landmarkId === 'constantine-bridges') {
      // Rhumel river canyon walls
      const leftCliffGeo = new THREE.BoxGeometry(10, 16, 32);
      const leftCliffMat = getMat({ color: 0x5a554a, roughness: 0.9 });
      const leftCliff = new THREE.Mesh(leftCliffGeo, leftCliffMat);
      leftCliff.position.set(-9.5, -4, 0);
      leftCliff.castShadow = true;
      leftCliff.receiveShadow = true;
      
      const rightCliffGeo = new THREE.BoxGeometry(10, 16, 32);
      const rightCliff = new THREE.Mesh(rightCliffGeo, leftCliffMat);
      rightCliff.position.set(9.5, -4, 0);
      rightCliff.castShadow = true;
      rightCliff.receiveShadow = true;

      // River flowing underneath
      const riverGeo = new THREE.PlaneGeometry(9, 32);
      riverGeo.rotateX(-Math.PI / 2);
      const riverMat = getMat({ color: 0x228b70, roughness: 0.1, metalness: 0.8 });
      const river = new THREE.Mesh(riverGeo, riverMat);
      river.position.set(0, -9.5, 0);
      river.receiveShadow = true;

      monumentGroup.add(leftCliff, rightCliff, river);
    } else {
      // Traditional ancient Roman or Moorish stone platform
      const baseGeo = new THREE.CylinderGeometry(10, 10.5, 0.5, 32);
      const baseMat = getMat({ 
        color: landmarkId === 'timgad' ? 0xcfa674 : 0xedeae0, 
        roughness: 0.8 
      });
      const basePodium = new THREE.Mesh(baseGeo, baseMat);
      basePodium.position.y = -1.25;
      basePodium.receiveShadow = true;
      monumentGroup.add(basePodium);
    }

    // Render exact architectural elements based on active monument
    switch (landmarkId) {
      case 'casbah': {
        // High fidelity Ottoman-style palace gateway
        const mainWallGeo = new THREE.BoxGeometry(8, 8, 2.5);
        const wallMat = getMat({ color: 0xf5f3e9, roughness: 0.7 }); // clay stucco
        const mainWall = new THREE.Mesh(mainWallGeo, wallMat);
        mainWall.position.y = 2.75;
        mainWall.castShadow = true;
        mainWall.receiveShadow = true;
        monumentGroup.add(mainWall);

        // Center gate cutout recess
        const gateRecessGeo = new THREE.BoxGeometry(3.6, 5.5, 2.6);
        const gateRecessMat = getMat({ color: 0x2c1f18, roughness: 0.95 }); // dark wood / shade
        const gateRecess = new THREE.Mesh(gateRecessGeo, gateRecessMat);
        gateRecess.position.set(0, 1.5, 0);
        monumentGroup.add(gateRecess);

        // Green glazed dome on top of the fort
        const domeGeo = new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = getMat({ color: 0x1d7051, roughness: 0.2, metalness: 0.4 }); // glazed green glaze
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.set(0, 6.75, 0);
        dome.castShadow = true;
        monumentGroup.add(dome);

        // Side column pillars
        const colGeo = new THREE.CylinderGeometry(0.25, 0.25, 5, 12);
        const colMat = getMat({ color: 0xcca35a, metalness: 0.5, roughness: 0.3 }); // shiny bronze/marble
        
        const leftCol = new THREE.Mesh(colGeo, colMat);
        leftCol.position.set(-2, 1.25, 1.3);
        leftCol.castShadow = true;

        const rightCol = leftCol.clone();
        rightCol.position.x = 2;

        // Column bases
        const colBaseGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
        const colBaseMat = getMat({ color: 0x888888 });
        
        const leftBase = new THREE.Mesh(colBaseGeo, colBaseMat);
        leftBase.position.set(-2, -1.05, 1.3);
        
        const rightBase = leftBase.clone();
        rightBase.position.x = 2;

        monumentGroup.add(leftCol, rightCol, leftBase, rightBase);

        // Cedar Wood lattice mashrabiya block
        const meshGeo = new THREE.BoxGeometry(2.2, 1.4, 0.2);
        const meshMat = getMat({ color: 0x4a2e1d, roughness: 0.8 });
        const cedarMesh = new THREE.Mesh(meshGeo, meshMat);
        cedarMesh.position.set(0, 3.8, 1.3);
        monumentGroup.add(cedarMesh);
        break;
      }

      case 'santa-cruz': {
        // High altitude Spanish fortress walls
        const wallMat = getMat({ color: 0xbaa793, roughness: 0.85 }); // old grey sandstone
        const fortBase = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 7), wallMat);
        fortBase.position.set(-1.5, 0.75, 0);
        fortBase.castShadow = true;
        fortBase.receiveShadow = true;
        monumentGroup.add(fortBase);

        // Wall crenels (defensive parapet elements)
        const crenelGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
        for (let i = -3; i <= 3; i += 1.8) {
          const crenelX = new THREE.Mesh(crenelGeo, wallMat);
          crenelX.position.set(-1.5 + i, 3.05, 3.1);
          monumentGroup.add(crenelX);
        }

        // Spanish watchtower corner overhang guerite
        const watchTowerGeo = new THREE.CylinderGeometry(0.7, 0.7, 2, 8);
        const watchTower = new THREE.Mesh(watchTowerGeo, wallMat);
        watchTower.position.set(-4.5, 2.5, 3);
        watchTower.castShadow = true;

        const watchConeGeo = new THREE.ConeGeometry(0.8, 0.9, 8);
        const watchConeMat = getMat({ color: 0x9e3b2b, roughness: 0.4 }); // red tile roof
        const watchCone = new THREE.Mesh(watchConeGeo, watchConeMat);
        watchCone.position.set(-4.5, 3.95, 3);
        
        monumentGroup.add(watchTower, watchCone);

        // High Chapel bell tower standing tall standing in background
        const towerGeo = new THREE.BoxGeometry(1.8, 6, 1.8);
        const towerMat = getMat({ color: 0xefebd8, roughness: 0.7 });
        const bellTowerCheck = new THREE.Mesh(towerGeo, towerMat);
        bellTowerCheck.position.set(2.5, 1.75, -2);
        bellTowerCheck.castShadow = true;
        
        // Golden Cross on peak
        const crossVertGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
        const crossHorGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
        const crossMat = getMat({ color: 0xd4af37, roughness: 0.1, metalness: 0.9 });
        
        const crossVert = new THREE.Mesh(crossVertGeo, crossMat);
        crossVert.position.set(2.5, 5.5, -2);
        
        const crossHor = new THREE.Mesh(crossHorGeo, crossMat);
        crossHor.position.set(2.5, 5.8, -2);
        crossHor.rotateZ(Math.PI / 2);

        monumentGroup.add(bellTowerCheck, crossVert, crossHor);
        break;
      }

      case 'tassili': {
        // Red sandstone desert wind arches
        const archGroup = new THREE.Group();
        const stoneMat = getMat({ color: 0x9e4c33, roughness: 0.9, metalness: 0.1 }); // dark red ochre

        // Left pillar column
        const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 6, 12), stoneMat);
        pillarL.position.set(-4, 1.5, 0);
        pillarL.castShadow = true;
        
        // Right pillar column
        const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 6, 12), stoneMat);
        pillarR.position.set(4, 1.5, 0);
        pillarR.castShadow = true;

        // Curved organic arch bridge lintel
        const torusGeo = new THREE.TorusGeometry(4, 1.25, 12, 24, Math.PI);
        const torusArch = new THREE.Mesh(torusGeo, stoneMat);
        torusArch.position.set(0, 4.25, 0);
        torusArch.castShadow = true;

        archGroup.add(pillarL, pillarR, torusArch);
        monumentGroup.add(archGroup);

        // Add historic cave line drawings on the left pillar face (Neolithic art)
        const lineMat = new THREE.LineBasicMaterial({ color: 0x3d0b00, linewidth: 2 });
        const points = [];
        points.push(new THREE.Vector3(-3.2, 2.5, 1.2));
        points.push(new THREE.Vector3(-3.4, 2.1, 1.2));
        points.push(new THREE.Vector3(-3.0, 1.8, 1.2));
        points.push(new THREE.Vector3(-3.2, 2.5, 1.2)); // Triangle body
        points.push(new THREE.Vector3(-3.6, 2.7, 1.2)); // Cow Horns 1
        points.push(new THREE.Vector3(-2.8, 2.9, 1.2)); // Cow Horns 2

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const artworkLine = new THREE.Line(lineGeo, lineMat);
        monumentGroup.add(artworkLine);

        // Scatter 3 small sandstone slabs around the desert dunes
        const boulderGeo = new THREE.DodecahedronGeometry(0.8);
        for (let j = 0; j < 3; j++) {
          const boulder = new THREE.Mesh(boulderGeo, stoneMat);
          boulder.position.set(
            j === 0 ? -6 : j === 1 ? 7 : 1,
            -1.0,
            j === 0 ? 4 : j === 1 ? -2 : -6
          );
          boulder.castShadow = true;
          monumentGroup.add(boulder);
        }
        break;
      }

      case 'constantine-bridges': {
        // Sidi M'Cid suspension path bridge construction
        const deckGeo = new THREE.BoxGeometry(20, 0.25, 1.4);
        const deckMat = getMat({ color: 0x2f3542, metalness: 0.6, roughness: 0.3 }); // road asphalt
        const bridgeDeck = new THREE.Mesh(deckGeo, deckMat);
        bridgeDeck.position.set(0, 1.2, 0);
        bridgeDeck.castShadow = true;
        monumentGroup.add(bridgeDeck);

        // Tall steel columns (Pylons) on left and right cliff sides
        const pylonGeo = new THREE.CylinderGeometry(0.18, 0.25, 7.5, 8);
        const steelMat = getMat({ color: 0x475569, metalness: 0.8, roughness: 0.2 }); // steel frame

        // Left bank towers
        const leftTower1 = new THREE.Mesh(pylonGeo, steelMat);
        leftTower1.position.set(-6, 3.5, 0.7);
        leftTower1.castShadow = true;
        
        const leftTower2 = leftTower1.clone();
        leftTower2.position.z = -0.7;

        // Left horizontal beam
        const bBeam = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 1.6), steelMat);
        bBeam.position.set(-6, 6.2, 0);
        
        // Right bank towers
        const rightTower1 = leftTower1.clone();
        rightTower1.position.x = 6;
        
        const rightTower2 = leftTower2.clone();
        rightTower2.position.x = 6;

        const bBeamRight = bBeam.clone();
        bBeamRight.position.x = 6;

        monumentGroup.add(leftTower1, leftTower2, bBeam, rightTower1, rightTower2, bBeamRight);

        // Cable lines spanning across towers
        const mainCableGeo = new THREE.CylinderGeometry(0.06, 0.06, 21, 8);
        const cableMat = getMat({ color: 0xd1d5db, metalness: 0.9 });
        
        const northCable = new THREE.Mesh(mainCableGeo, cableMat);
        northCable.position.set(0, 4.4, 0.7);
        northCable.rotateZ(Math.PI / 2.08); // slightly sloped downward
        
        const southCable = northCable.clone();
        southCable.position.z = -0.7;

        monumentGroup.add(northCable, southCable);

        // Thin vertical stay cables
        for (let xPos = -4; xPos <= 4; xPos += 2) {
          if (xPos === 0) continue;
          const hangerGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 4);
          
          const hangerN = new THREE.Mesh(hangerGeo, cableMat);
          hangerN.position.set(xPos, 2.4, 0.7);
          
          const hangerS = hangerN.clone();
          hangerS.position.z = -0.7;

          monumentGroup.add(hangerN, hangerS);
        }
        break;
      }

      case 'timgad': {
        // Triumphal Roman sandstone sandy Arch of Trajan
        const blockMat = getMat({ color: 0xdfb784, roughness: 0.8 }); // Roman limestone

        // Main wide base body
        const mainBlockCheck = new THREE.Mesh(new THREE.BoxGeometry(8, 5.5, 2.2), blockMat);
        mainBlockCheck.position.y = 1.5;
        mainBlockCheck.castShadow = true;
        mainBlockCheck.receiveShadow = true;
        monumentGroup.add(mainBlockCheck);

        // Side wing arches (secondary cutout visual helpers)
        const atticBlock = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.2, 2.4), blockMat);
        atticBlock.position.y = 4.85;
        atticBlock.castShadow = true;
        monumentGroup.add(atticBlock);

        // Central grand arch cutout representation
        const passageGeo = new THREE.BoxGeometry(3.2, 4.25, 2.5);
        const passageMat = getMat({ color: 0x3d2b20, roughness: 0.95 });
        const passageCenter = new THREE.Mesh(passageGeo, passageMat);
        passageCenter.position.set(0, 0.85, 0);
        monumentGroup.add(passageCenter);

        // Side arches cutouts (Trajan arch has smaller wings)
        const leftSidePassage = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.6, 2.5), passageMat);
        leftSidePassage.position.set(-2.5, 0.1, 0);
        
        const rightSidePassage = leftSidePassage.clone();
        rightSidePassage.position.x = 2.5;
        
        monumentGroup.add(leftSidePassage, rightSidePassage);

        // Fluted support columns (Columns standing in decorative array)
        const columnGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.5, 12);
        const columnMat = getMat({ color: 0xeedcbd, roughness: 0.6 });
        
        const frontCol1 = new THREE.Mesh(columnGeo, columnMat);
        frontCol1.position.set(-1.8, 1.0, 1.3);
        frontCol1.castShadow = true;

        const frontCol2 = frontCol1.clone();
        frontCol2.position.x = 1.8;

        const frontCol3 = frontCol1.clone();
        frontCol3.position.x = -3.4;

        const frontCol4 = frontCol1.clone();
        frontCol4.position.x = 3.4;

        monumentGroup.add(frontCol1, frontCol2, frontCol3, frontCol4);
        break;
      }
    }

    scene.add(monumentGroup);

    // 6. Spawn interactive glowing pulsing beacons inside the 3D scene representation
    const activeHotspots = hotspotsData[landmarkId] || [];
    const beaconMeshesGroup = new THREE.Group();
    const beaconRings: THREE.Mesh[] = [];

    // Raycasting tools to handle direct clicking
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    activeHotspots.forEach((spot, index) => {
      // Glow core sphere
      const beaconVertGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const beaconVertMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37, // golden core
        transparent: true,
        opacity: 0.9
      });
      const beaconCore = new THREE.Mesh(beaconVertGeo, beaconVertMat);
      beaconCore.position.copy(spot.pos);
      beaconCore.name = `beacon_${spot.name}`;
      
      // Spinning secondary halo rings
      const haloGeo = new THREE.TorusGeometry(0.55, 0.05, 8, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, // ambient space cyan/blue
        transparent: true,
        opacity: 0.65
      });
      const ringMesh = new THREE.Mesh(haloGeo, haloMat);
      ringMesh.position.copy(spot.pos);
      ringMesh.rotateX(Math.PI / 2);
      
      beaconMeshesGroup.add(beaconCore, ringMesh);
      beaconRings.push(ringMesh);
    });

    scene.add(beaconMeshesGroup);

    // 7. Click Detection Event Handlers
    const handleCanvasClick = (event: MouseEvent) => {
      // Prevent raycasting during drag orbits
      if (interactionRef.current.isDragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const clickX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouseVector.set(clickX, clickY);
      raycaster.setFromCamera(mouseVector, camera);

      // Check hits on beacon cores
      const intersects = raycaster.intersectObjects(beaconMeshesGroup.children);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.name && hit.name.startsWith('beacon_')) {
          const spotName = hit.name.replace('beacon_', '');
          const spotMatch = activeHotspots.find(s => s.name === spotName);
          if (spotMatch) {
            onHotspotSelect({ name: spotMatch.name, info: spotMatch.info });
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 8. Handle Mouse Drag interaction mechanisms to control Orbit cameras
    const onMouseDown = (event: MouseEvent) => {
      interactionRef.current.isDragging = true;
      interactionRef.current.prevMouseX = event.clientX;
      interactionRef.current.prevMouseY = event.clientY;
      interactionRef.current.autoRotate = false; // suspend auto spin upon interaction
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!interactionRef.current.isDragging) return;
      const deltaX = event.clientX - interactionRef.current.prevMouseX;
      const deltaY = event.clientY - interactionRef.current.prevMouseY;

      interactionRef.current.prevMouseX = event.clientX;
      interactionRef.current.prevMouseY = event.clientY;

      // Update polar angular targets
      interactionRef.current.targetTheta -= deltaX * 0.007;
      interactionRef.current.targetPhi -= deltaY * 0.007;

      // Clamp targetPhi range to prevent camera flipping on top/bottom
      interactionRef.current.targetPhi = Math.max(0.1, Math.min(Math.PI / 2.1, interactionRef.current.targetPhi));
    };

    const onMouseUp = () => {
      interactionRef.current.isDragging = false;
    };

    // Mobile touch controls support
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        interactionRef.current.isDragging = true;
        interactionRef.current.prevMouseX = event.touches[0].clientX;
        interactionRef.current.prevMouseY = event.touches[0].clientY;
        interactionRef.current.autoRotate = false;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!interactionRef.current.isDragging || event.touches.length !== 1) return;
      const deltaX = event.touches[0].clientX - interactionRef.current.prevMouseX;
      const deltaY = event.touches[0].clientY - interactionRef.current.prevMouseY;

      interactionRef.current.prevMouseX = event.touches[0].clientX;
      interactionRef.current.prevMouseY = event.touches[0].clientY;

      interactionRef.current.targetTheta -= deltaX * 0.009;
      interactionRef.current.targetPhi -= deltaY * 0.009;
      interactionRef.current.targetPhi = Math.max(0.1, Math.min(Math.PI / 2.1, interactionRef.current.targetPhi));
    };

    const onTouchEnd = () => {
      interactionRef.current.isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // 9. Interactive rendering ticking animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();

      // Horizontal autowave rotation if active
      if (interactionRef.current.autoRotate && !interactionRef.current.isDragging) {
        interactionRef.current.targetTheta += delta * 0.12; // slowly rotate clockwise
      }

      // Smooth interpolation for smooth camera cinematic glide (LERP)
      interactionRef.current.theta += (interactionRef.current.targetTheta - interactionRef.current.theta) * 0.085;
      interactionRef.current.phi += (interactionRef.current.targetPhi - interactionRef.current.phi) * 0.085;
      interactionRef.current.radius += (interactionRef.current.targetRadius - interactionRef.current.radius) * 0.085;

      // Calculate camera coordinates using polar/spherical projections
      const targetLookCenter = new THREE.Vector3(0, landmarkId === 'constantine-bridges' ? 1 : 1.5, 0);
      
      camera.position.setFromSphericalCoords(
        interactionRef.current.radius,
        interactionRef.current.phi,
        interactionRef.current.theta
      ).add(targetLookCenter);

      camera.lookAt(targetLookCenter);

      // Animate the beacons glowing rotation effect
      const elapsed = clock.getElapsedTime();
      beaconRings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (1.1 + (idx * 0.2));
        // Pulsing scale
        ring.scale.setScalar(1 + Math.sin(elapsed * 4.5 + idx) * 0.15);
      });

      // Animate Tassili river details or monuments
      if (landmarkId === 'constantine-bridges') {
        monumentGroup.position.y = Math.sin(elapsed * 0.8) * 0.05; // tiny micro sway
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    renderLoop();

    // 10. Handle window responsive resizes
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    // Cleanup resources strictly on unmount or prop changes to prevent core memory leak
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Deep traverse dispose of memory
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => (mat as THREE.Material).dispose());
          } else {
            (mesh.material as THREE.Material).dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [landmarkId, lightPreset, showWireframe]);

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Dynamic 3D interactive HUD elements */}
      <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 border border-[#d4af37]/30 text-white font-mono text-[9px] uppercase tracking-widest pointer-events-none z-10 flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>WebGL Exact 3D Engine • Active</span>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-2 py-1 border border-white/10 text-slate-400 font-mono text-[8px] uppercase tracking-widest pointer-events-none z-10">
        <span>🖱️ Drag to Orbit • pinch to Zoom</span>
      </div>

      {/* Show reset auto-rotate option */}
      <button
        onClick={() => {
          interactionRef.current.autoRotate = !interactionRef.current.autoRotate;
        }}
        className="absolute bottom-4 right-4 bg-black/80 hover:bg-[#d4af37] hover:text-black hover:border-black transition-all border border-[#d4af37]/30 text-[#d4af37] py-1.5 px-3 font-mono text-[8.5px] uppercase tracking-widest flex items-center space-x-1 cursor-pointer z-10 shadow-lg"
      >
        <RefreshCw size={9} className={interactionRef.current.autoRotate ? 'animate-spin' : ''} />
        <span>{interactionRef.current.autoRotate ? 'Freeze camera' : 'orbit rotation'}</span>
      </button>
    </div>
  );
};

export const DigitalTwin: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { favorites, toggleFavorite, currentUser } = useApp();

  // Active view type: 'panorama' for original 360 images, 'exact3d' for real-time solid 3D render
  const [viewMode, setViewMode] = useState<'panorama' | 'exact3d'>('exact3d');
  const [activeSpot, setActiveSpot] = useState<Landmark>(mockLandmarks[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [audioFeedbackOn, setAudioFeedbackOn] = useState(false);
  
  // Custom states for exact 3D render environment
  const [lightPreset, setLightPreset] = useState<'day' | 'sunset' | 'midnight'>('sunset');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<{ name: string; info: string } | null>(null);

  const hotSpotsByLandmark: { [key: string]: { name: string; info: string; angle: number; top: string; left: string }[] } = {
    casbah: [
      { name: 'Ketchaoua Ottoman Columns', info: 'Dating back to the Ottoman Empire, combining Byzantine and Moorish engineering standards.', angle: 45, top: '40%', left: '30%' },
      { name: 'Traditional Glazed Dome', info: 'Iconic green glazed hemispherical dome crowning Ottoman residential quarters.', angle: 180, top: '55%', left: '60%' },
      { name: 'Wooden Mashrabiya', info: 'Detailed cedar lattice panels allowing fresh sea breezes while maintaining absolute privacy.', angle: 270, top: '25%', left: '80%' }
    ],
    'santa-cruz': [
      { name: 'Spanish Bastions', info: 'Heavily reinforced thick stone battlements designed by Spanish engineers in the 16th century.', angle: 90, top: '45%', left: '25%' },
      { name: 'Bell Chapel Tower', info: 'Dedicated to Notre Dame de Santa Cruz, honoring the historical epidemic relief.', angle: 15, top: '30%', left: '72%' }
    ],
    tassili: [
      { name: 'La Vache Qui Pleure Carving', info: 'Neolithic sandstone masterpiece depicting weeping cattle, proving ancient Sahara was once green.', angle: 230, top: '50%', left: '15%' },
      { name: 'Melodic Sandstone Vent', info: 'Natural wind-hollowed sandstone flute passage that whistles during desert sandstorms.', angle: 110, top: '65%', left: '75%' }
    ],
    'constantine-bridges': [
      { name: 'Sidi M’Cid Suspension Pylons', info: 'Majestic steel frame towers constructed by renowned French engineer Ferdinand Arnodin in 1912.', angle: 160, top: '32%', left: '45%' },
      { name: 'Rhumel River Gorge', info: 'Deep limestone canyon carved by mountain rivers, acting as an impregnable fortress moat.', angle: 300, top: '70%', left: '20%' }
    ],
    timgad: [
      { name: 'Roman Arch Plaque', info: 'Sandstone engraved attic dedicating the triumphal gateway to Emperor Trajan (AD 100).', angle: 40, top: '38%', left: '50%' },
      { name: 'Corinthian Fluted Capitals', info: 'Classical Roman columns made of high-grade fossilized Aurean limestone.', angle: 135, top: '60%', left: '30%' }
    ]
  };

  const handleRotation = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
    setSelectedHotspot(null);
  };

  const handleStepSelect = (index: number) => {
    setActiveStep(index);
    setSelectedHotspot(null);
  };

  const isFavorited = favorites.includes(activeSpot.id);
  const currentHotspots = hotSpotsByLandmark[activeSpot.id] || [];

  const handleHotspotClickFrom3D = (info: { name: string; info: string }) => {
    setSelectedHotspot({ name: info.name, info: info.info });
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4" id="digital-twin-core">
      
      {/* Overview Block */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl font-serif font-bold italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed] sm:text-4xl text-center">
          {t('twinTitle')}
        </h1>
        <p className="mt-4 text-xs tracking-widest uppercase font-mono text-[#d4af37]">
          {t('twinSubtitle')}
        </p>
      </div>

      {/* Target Landmark Tabs */}
      <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-4 mb-8 justify-start sm:justify-center pr-1 scrollbar-none">
        {mockLandmarks.map((landmark) => (
          <button
            key={landmark.id}
            onClick={() => {
              setActiveSpot(landmark);
              setActiveStep(0);
              setRotationAngle(0);
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 rounded-none border ${
              activeSpot.id === landmark.id
                ? 'bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#f5f2ed] dark:text-[#1a1a1a] border-[#d4af37] font-bold shadow-lg'
                : 'bg-transparent text-[#1a1a1a]/80 dark:text-[#f5f2ed]/80 border-[#1a1a1a]/15 dark:border-white/10 hover:border-[#d4af37]'
            }`}
          >
            {landmark.name}
          </button>
        ))}
      </div>

      {/* Main Sandbox Interactive Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Virtual 3D View Screen - 8 Columns */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Real-time solid 3D mode vs 360 photo screen mode toggle */}
          <div className="flex bg-[#eae7e1] dark:bg-black p-1 border border-[#1a1a1a]/10 dark:border-white/10 justify-between items-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1a1a1a]/80 dark:text-white/80 pl-3">
              🖥️ Viewing module mode selection:
            </span>
            <div className="flex space-x-1 space-x-reverse">
              <button
                onClick={() => {
                  setViewMode('exact3d');
                  setSelectedHotspot(null);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest cursor-pointer border ${
                  viewMode === 'exact3d'
                    ? 'bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black border-[#d4af37] font-bold'
                    : 'bg-transparent text-[#1a1a1a] dark:text-white border-transparent'
                }`}
              >
                <Layers size={11} className="text-[#d4af37]" />
                <span>Exact 3D Solid Mesh</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('panorama');
                  setSelectedHotspot(null);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest cursor-pointer border ${
                  viewMode === 'panorama'
                    ? 'bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black border-[#d4af37] font-bold'
                    : 'bg-transparent text-[#1a1a1a] dark:text-white border-transparent'
                }`}
              >
                <Compass size={11} className="text-[#d4af37]" />
                <span>360° Photo Panorama</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b0f19] rounded-none overflow-hidden relative border border-[#1a1a1a]/20 dark:border-white/15 shadow-2xl h-[480px] group flex flex-col justify-between">
            
            {viewMode === 'exact3d' ? (
              /* REAL-TIME WEBGL THREE.JS CANVAS */
              <Monument3DViewer
                landmarkId={activeSpot.id}
                isPremium={currentUser?.isPremium ?? false}
                language={language}
                onHotspotSelect={handleHotspotClickFrom3D}
                selectedHotspotName={selectedHotspot ? selectedHotspot.name : null}
                lightPreset={lightPreset}
                showWireframe={showWireframe}
              />
            ) : (
              /* ORIGINAL 2D PHOTO PANORAMA SIMULATOR VIEW */
              <>
                {/* 3D Panorama Frame (Simulated Image perspective & dynamic rotational styling) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={activeSpot.panoramas[activeStep] || activeSpot.image}
                    alt={activeSpot.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out brightness-80"
                    style={{
                      transform: `scale(1.15) rotate(${rotationAngle}deg)`,
                      filter: 'contrast(1.05) brightness(0.85)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                </div>

                {/* Dashboard telemetry bars */}
                <div className="relative z-10 p-4 sm:p-6 flex justify-between items-start pointer-events-none w-full">
                  <div className="bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-none flex items-center space-x-2 space-x-reverse text-white pointer-events-auto">
                    <Compass className="text-[#d4af37] animate-spin-slow" size={14} />
                    <span className="text-[9px] uppercase font-mono tracking-widest font-bold">
                      Panorama {activeStep + 1} / {activeSpot.panoramas.length}
                    </span>
                  </div>

                  <div className="flex space-x-2 space-x-reverse pointer-events-auto">
                    {/* Audio guide trigger */}
                    <button
                      onClick={() => setAudioFeedbackOn(!audioFeedbackOn)}
                      className={`p-2.5 border transition-all cursor-pointer rounded-none ${
                        audioFeedbackOn 
                          ? 'bg-[#d4af37] text-black border-black' 
                          : 'bg-black/75 text-slate-300 border-white/15 hover:bg-black/90'
                      }`}
                      title="Play Simulated Atmospheric Ambient sound"
                    >
                      <Volume2 size={13} />
                    </button>

                    <button
                      onClick={() => toggleFavorite(activeSpot.id)}
                      className={`p-2.5 border transition-all cursor-pointer rounded-none ${
                        isFavorited 
                          ? 'bg-[#d4af37] text-black border-black font-bold' 
                          : 'bg-black/75 text-slate-300 border-white/15 hover:bg-black/90'
                      }`}
                    >
                      <Bookmark size={13} className={isFavorited ? 'fill-black' : ''} />
                    </button>
                  </div>
                </div>

                {/* Simulated interactive hotspots layered on top */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {currentHotspots.map((hotspot, idx) => (
                    <div
                      key={idx}
                      className="absolute pointer-events-auto"
                      style={{ top: hotspot.top, left: hotspot.left }}
                    >
                      <button
                        onClick={() => setSelectedHotspot(selectedHotspot?.name === hotspot.name ? null : { name: hotspot.name, info: hotspot.info })}
                        className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#d4af37] text-black hover:bg-amber-600 focus:outline-none shadow-lg animate-pulse cursor-pointer"
                        title={hotspot.name}
                      >
                        <Eye size={12} />
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                      </button>

                      {/* Hotspot details bubble */}
                      {selectedHotspot?.name === hotspot.name && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-[#f5f2ed] text-black border border-[#d4af37] p-3 shadow-2xl z-50 text-[10px] animate-fade-in leading-relaxed font-sans font-semibold">
                          <h4 className="font-serif italic font-bold text-[#1a1a1a] mb-1 leading-none">{hotspot.name}</h4>
                          <p>{hotspot.info}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom HUD dashboard for virtual control */}
                <div className="relative z-10 p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pointer-events-auto">
                  
                  {/* Perspective steps indicators */}
                  <div className="flex space-x-1 px-2.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-none space-x-reverse justify-center">
                    {activeSpot.panoramas.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleStepSelect(index)}
                        className={`h-2 transition-all duration-300 cursor-pointer ${
                          activeStep === index ? 'w-8 bg-[#d4af37]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                        }`}
                        title={`Go to view viewpoint ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Rotational controls */}
                  <div className="flex space-x-2 space-x-reverse justify-center">
                    <button
                      onClick={handleRotation}
                      className="px-4 py-2 bg-black/75 backdrop-blur-md border border-[#d4af37]/30 hover:bg-black text-[#d4af37] text-[10px] font-mono uppercase tracking-widest flex items-center space-x-1.5 space-x-reverse shadow-lg cursor-pointer"
                    >
                      <RotateCw size={12} />
                      <span>Rotate Photo View</span>
                    </button>
                  </div>

                </div>
              </>
            )}

          </div>

          {/* Render real-time exact 3D controls bar if 3D mode is active */}
          {viewMode === 'exact3d' && (
            <div className="bg-[#eae7e1] dark:bg-[#161616] border border-[#1a1a1a]/15 dark:border-white/10 p-4 flex flex-wrap gap-4 items-center justify-between">
              
              {/* Dynamic light preset controller triggers */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a]/70 dark:text-gray-400 font-bold">
                  ☀️ Solar Gaze Ambient:
                </span>
                <div className="flex border border-[#1a1a1a]/15 dark:border-white/10">
                  <button
                    onClick={() => setLightPreset('day')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest cursor-pointer ${
                      lightPreset === 'day' 
                        ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-bold' 
                        : 'bg-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Day Oasis
                  </button>
                  <button
                    onClick={() => setLightPreset('sunset')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest cursor-pointer ${
                      lightPreset === 'sunset' 
                        ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-bold' 
                        : 'bg-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Sunset Warm
                  </button>
                  <button
                    onClick={() => setLightPreset('midnight')}
                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest cursor-pointer ${
                      lightPreset === 'midnight' 
                        ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-bold' 
                        : 'bg-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Desert Void
                  </button>
                </div>
              </div>

              {/* Wireframe solid polygons toggle */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a]/70 dark:text-gray-400 font-bold">
                  📐 Digital Twin Blueprint:
                </span>
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`px-3 py-1 border font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer ${
                    showWireframe 
                      ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold' 
                      : 'border-[#1a1a1a]/20 text-[#1a1a1a]/80 dark:border-white/20 dark:text-white'
                  }`}
                >
                  {showWireframe ? 'View Solid Architectural Model' : 'View Polygon Wireframes'}
                </button>
              </div>

            </div>
          )}

          {/* Audio voice simulation bar */}
          {audioFeedbackOn && viewMode === 'panorama' && (
            <div className="p-4 bg-[#eae7e1]/80 dark:bg-[#1c1c1c]/80 border border-[#d4af37]/30 text-xs text-black dark:text-[#f5f2ed] animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 space-x-reverse">
                  <Volume2 className="text-[#d4af37] animate-bounce" size={16} />
                  <span className="font-semibold">Playing: Simulated Historic Echo acoustics for {activeSpot.name} ...</span>
                </div>
                <span className="font-mono text-[10px] text-gray-400">Sample: 44.1kHz</span>
              </div>
            </div>
          )}

        </div>
 
        {/* Informative Chronicle Sidebar - 4 Columns */}
        <div className="lg:col-span-4 bg-[#eae7e1]/30 dark:bg-[#161616]/30 border border-[#1a1a1a]/15 dark:border-white/10 rounded-none p-6 shadow-xl flex flex-col justify-between">
          
          <div>
            <div className="flex items-center space-x-2 space-x-reverse border-b border-[#1a1a1a]/15 dark:border-white/10 pb-4 mb-5">
              <BookOpen className="text-[#d4af37]" size={16} />
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#1a1a1a] dark:text-white font-bold">
                {t('quickFacts')}
              </h3>
            </div>

            {/* Target Spot Description */}
            <p className="text-xs text-gray-700 dark:text-slate-350 leading-relaxed font-sans mb-6">
              {activeSpot.description[language] || activeSpot.description['en']}
            </p>

            {/* List of facts points */}
            <div className="space-y-4 mb-6">
              {(activeSpot.facts[language] || activeSpot.facts['en']).map((fact, id) => (
                <div key={id} className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-5 h-5 bg-[#1a1a1a] dark:bg-white text-[#d4af37] dark:text-black border border-[#d4af37] flex items-center justify-center text-[9px] font-mono font-bold shrink-0 mt-0.5">
                    {id + 1}
                  </div>
                  <p className="text-xs text-gray-7  00 dark:text-slate-300 leading-relaxed font-serif italic">
                    {fact}
                  </p>
                </div>
              ))}
            </div>

            {/* 3D Model specific hotspot facts catalog trigger */}
            {viewMode === 'exact3d' && (
              <div className="border-t border-[#1a1a1a]/10 dark:border-white/10 pt-5 mt-5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold mb-3 flex items-center space-x-1">
                  <Sparkles size={11} />
                  <span>3D Key Structural Hotspots (Exact)</span>
                </h4>
                
                {/* Hotspot Catalog Buttons */}
                <div className="flex flex-col space-y-1.5">
                  {(hotspotsData[activeSpot.id] || []).map((spot, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedHotspot({ name: spot.name, info: spot.info });
                      }}
                      className={`text-right w-full text-start px-3 py-2 text-xs transition-all border ${
                        selectedHotspot?.name === spot.name
                          ? 'bg-[#d4af37]/25 text-black dark:text-[#f5f2ed] border-[#d4af37] font-bold'
                          : 'bg-[#1a1a1a]/5 dark:bg-white/5 text-[#1a1a1a]/85 dark:text-white/85 border-transparent hover:border-[#1a1a1a]/20 hover:bg-black/5'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-semibold text-[11px] truncate">{spot.name}</span>
                        <span className="text-[9px] text-[#d4af37] font-mono">Zoom &rarr;</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* Hotspot details bubble inline if selected */}
                {selectedHotspot && (
                  <div className="mt-4 p-3.5 border border-[#d4af37] bg-[#d4af37]/5 text-xs animate-fade-in font-sans leading-relaxed">
                    <strong className="block text-[#1a1a1a] dark:text-white mb-1 text-[11px] font-mono uppercase border-b border-[#d4af37]/25 pb-1">
                      🔍 {selectedHotspot.name}
                    </strong>
                    <p className="text-[#1a1a1a] dark:text-[#f5f2ed]/90 text-[11px]">
                      {selectedHotspot.info}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Premium access overlay if applicable */}
          <div className="mt-8 pt-6 border-t border-[#1a1a1a]/10 dark:border-white/10">
            <div className="bg-[#eae7e1]/80 dark:bg-black/40 p-4 border border-[#d4af37]/35">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-2.5 flex items-center space-x-1.5 space-x-reverse">
                <Sparkles size={13} className="text-[#d4af37]" />
                <span>Rihla Gold VIP 3D rendering Privilege</span>
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-white/60 leading-relaxed mb-3">
                Access higher precision textures, automated vector alignment, and immersive acoustic parameters.
              </p>
              {currentUser?.isPremium ? (
                <span className="inline-flex items-center space-x-1 border border-[#d4af37] py-1 px-2.5 bg-[#d4af37]/10 text-[#d4af37] text-[9px] font-mono font-bold uppercase tracking-widest">
                  <span>✓ Authorized VIP Level Access</span>
                </span>
              ) : (
                <button 
                  className="text-[9px] font-mono uppercase tracking-widest text-[#d4af37] font-bold underline hover:text-amber-500 cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById('dashboard-premium-pricing');
                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Upgrade Membership Plan &rarr;
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

import { createChunk, createWorld } from '/chunkCreation.js'

const canvas = document.getElementById('canvas');
let scene = 5, camera, renderer, controls, renderDistance = 2, previousChunk = {x: null, y: null};

function initControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
}

function initThree(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.updateProjectionMatrix();
    camera.position.z = 50;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(parseInt(window.getComputedStyle(canvas).width), parseInt(window.getComputedStyle(canvas).height));
}

function loadChunks(){
    let chunkX = Math.floor(camera.position.x / 16);
    let chunkY = Math.floor(camera.position.y / 16);

    if (chunkX != previousChunk.x || chunkY != previousChunk.y){
        for (let i = 0; i < scene.children.length; i++){
            if (scene.children[i].type == 'Group'){
                const x = parseInt(scene.children[i].name.slice(0, scene.children[i].name.indexOf(',')));
                const y = parseInt(scene.children[i].name.slice(scene.children[i].name.indexOf(',') + 1, scene.children[i].name.length));
                if (x < chunkX - renderDistance || x > chunkX + renderDistance || y < chunkY - renderDistance || y > chunkY + renderDistance){
                    scene.remove(scene.children[i]);
                    i--;
                }
            }
        }
    
        for (let i = chunkX - renderDistance; i <= chunkX + renderDistance; i++){
            for (let j = chunkY - renderDistance; j <= chunkY + renderDistance; j++){
                if (scene.children.filter(group => group.name == `${i},${j}`).length == 0){
                    createChunk(i, j, scene);
                }
            }
        }

        previousChunk.x = chunkX;
        previousChunk.y = chunkY;
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    loadChunks();
}

initThree()
initControls();

createWorld();

animate();
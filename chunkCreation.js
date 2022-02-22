import 'https://unpkg.com/simplex-noise@2.4.0/simplex-noise.js';
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

let simplex, chunkSize = 16, height = 16, worldExists = false;

export function createWorld(seed, scene){
    console.log(seed);
    if (worldExists){
        destroyWorld(scene);
    }

    if (seed){
        simplex = new SimplexNoise(seed);
    } else {
        simplex = new SimplexNoise();
    }

    worldExists = true;
}

function destroyWorld(scene){
    for (let i = 0; i < scene.children.length; i++){
        if (scene.children[i].type == 'Group'){
            scene.remove(scene.children[i]);
            i--;
        }
    }
}

export function createChunk(x, y, scene){
    const chunk = new THREE.Group();
    chunk.name = `${x},${y}`;
    for (let i = 0; i < chunkSize; i++) {
        for (let j = 0; j < chunkSize; j++) {
            let smoothness = 0.025;
            let scale = 2;
            let noise = Math.floor(simplex.noise2D((i + x * chunkSize) * smoothness, (j + y * chunkSize) * smoothness) * scale);
            createBox(i, j, noise, chunk);
        }
    }
    chunk.position.x = x * chunkSize;
    chunk.position.y = y * chunkSize;
    scene.add(chunk);
}

function createBox(x, y, z, chunk){
    let material, mesh;
    let geometry = new THREE.BoxGeometry(2, 2, 2);

    if (z == 0 ){
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    } else if ( z > 0){
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    } else if ( z < 0 ) {
        material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    }

    for (let i = z; i > -height; i--){
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, i);
        chunk.add(mesh);
    }
}
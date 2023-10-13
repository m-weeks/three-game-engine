import * as THREE from 'three';
import Asset from "./Asset";

class JSONAsset extends Asset {
    async load() {
        return new Promise((resolve, reject) => {
            const fileLoader = new THREE.FileLoader();
            const fullURL = this.getFullURL();
            fileLoader.load(fullURL,
                function(text) {
                    this.json = JSON.parse(text);
                    resolve();
                },
                () => {
                    // on progress
                },
                error => {
                    reject(error);
                }
            );
        })
    }
}

export default JSONAsset;
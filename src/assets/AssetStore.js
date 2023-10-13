import Asset from './Asset';

class AssetStore {
  constructor(options = {}) {
    this.options = options;
    this.loadedAssets = {}; // key/value pairs  (url is key, asset is value) all files currently loaded
    this.initialized = false;
  }

  async init() {
    this.baseURL = await this.getBaseURL()
    this.initialized = true;
  }

  async getBaseURL() {
    if (this.options.baseURL) {
      return this.options.baseURL
    }
  
    if (window.electron) {
      const isPackaged = await window.electron.isAppPackaged();
      if (isPackaged) {
        const resourcesPath = window.electron.getResourcesPath();
        return `file://${resourcesPath}/assets`;
      } else {
        const dirName = window.electron.getDirName();
        return `file://${dirName}/../../../assets`;
      }
    } else {
      return `http://localhost:8080`;
    }
  }

  /**
   * Fetches the asset file located at the given relative URL, and adds
   * to the internal list of loaded assets.
   **/
  async load(path) {
    if (!this.initialized) {
      throw new Error('must call assetStore.init() before using load()')
    }

    const AssetSubclass = Asset.getAssetSubclass(path);
    const asset = new AssetSubclass(this.baseURL, path);
    await asset.load().then(() => {
      console.log(`AssetStore: successfully loaded: ${path}`);
      this.loadedAssets[path] = asset;
    }, error => {
      console.error(`AssetStore: error loading: ${path}: ${error}`);
      throw error;
    })
  }

  unload(path) {
    const asset = this.loadedAssets[path];
    if (asset) {
      this.loadedAssets[path] = null;
      console.log(`Assets: unloaded ${path}`);
    } else {
      console.log(`Assets: unloading ${path} - skipped, not currently loaded`);
    }
  }

  /**
   * Returns the Asset instance for the asset with the given path
   */
  get(path) {
    const asset = this.loadedAssets[path];
    if (!asset) {
      throw new Error(`Asset not loaded: ${path}`);
    }
    return asset;
  }
}

export default AssetStore;
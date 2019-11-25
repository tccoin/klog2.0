import './marked.min.js';
import blocks from './blocks.js';

class MoonEditor {

  constructor(element) {
    console.log(element);
    this.version = "0.0.1";
  }

  toString() {
    return 'Klog Editor Moon v ' + version;
  }
};

export default MoonEditor;
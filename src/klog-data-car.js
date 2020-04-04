import '@polymer/polymer/polymer-element.js';
import './klog-data-gql.js';
class klogDataCar extends KlogDataGql {
  static get is() { return 'klog-data-car'; }

  static get properties() {
    return {
      cars: {
        type: Array,
        notify: true
      }
    }
  }

  ready() {
    super.ready();
    this.auto = true;
    this.query = gql`
        Car(limit:5){
          filename
        }
    `;
  }

  handle(data) {
    super.handle(data);
    this.cars = this.lastResponse.Car;
  }
}
window.customElements.define(klogDataCar.is, klogDataCar);

import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';

class KlogApps extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }
    </style>

    <app-route route="{{route}}" pattern="/:appName" data="{{routeData}}"></app-route>
`;
  }

  static get is() { return 'klog-apps'; }

  static get observers() {
    return [
      'loadApp(routeData.appName)',
    ]
  }

  async update(userdata, subroute) {
    this.route = subroute;
  }

  loadApp(appName) {
    if (!appName) return;
    this.dispatchEvent(new CustomEvent('drawer-disable', { bubbles: true, composed: true }));
    import('../apps/klog-apps-' + appName + '.js').then(() => {
      let app = document.createElement('klog-apps-' + appName);
      this.shadowRoot.append(app);
      app.load();
      this.app = app;
    });
  }

  unload() {
    return this.app.unload();
  }
}

window.customElements.define(KlogApps.is, KlogApps);

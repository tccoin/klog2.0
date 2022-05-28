import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogDataLicenseMixin } from '../data/klog-data-license-mixin.js';
import '../ui/klog-icons-license.js';
import '../ui/klog-popup.js';

class KlogRenderLicense extends KlogDataLicenseMixin(PolymerElement) {
    static get template() {
        return html `
    <style>
      a {
        color: inherit;
      }
    </style>
    <span id="container"></span>
    <span id="iconContainer"></span>
    `;
    }

    static get is() { return 'klog-render-license'; }

    static get properties() {
        return {
            license: {
                type: String
            },
            defaultLicense: {
                type: String
            },
        };
    }

    static get observers() {
        return [
            '_update(license, defaultLicense)'
        ];
    }

    _update(article_license, user_license) {
        let name = article_license == 'default' ? user_license : article_license;
        let license;
        for (let item of this.fullLicenseList) {
            if (item.name == name) {
                license = item;
                break;
            }
        }
        if (license) {
            this.$.container.innerHTML = license.description;
            let link = this.$.container.querySelector('a');
            if (link) {
                link.target = '_blank';
            }
            let icons = '';
            for (let icon of license.icon) {
                if (icon == 'cc') continue;
                icons += `
          <span class="item">
            <iron-icon icon="license:${icon}" id="${icon}"></iron-icon>
            <klog-popup for="${icon}" vertical-offset="8">
              <strong>${this.licenseIconList[icon].title}</strong><br>
              ${this.licenseIconList[icon].description}
            </klog-popup>
          </span>
        `;
            }
            this.$.iconContainer.innerHTML = icons;
        } else {
            this._update('all-rights-reserved');
        }
    }
}

window.customElements.define(KlogRenderLicense.is, KlogRenderLicense);
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import './klog-style-layout.js';
import './klog-style-card.js';

class KlogAppsLib extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: block;
      }

      .klog-card {
        max-width: 1024px;
        width: 100%;
        margin: 32px auto;
        padding: 16px;
      }

      #content {
        white-space: pre;
      }
    </style>

    <div class="klog-card">
      <paper-button id="authorizeButton">Authorize</paper-button>
      <paper-button id="signoutButton">Sign Out</paper-button>
    </div>

    <div class="klog-card">
      <div id="content"></div>
    </div>
`;
  }

  static get is() { return 'klog-apps-lib'; }

  static get properties() {
    return {
      layout: {}
    }
  }

  load() {
    this.dispatchEvent(new CustomEvent('layout-update', {
      bubbles: true,
      composed: true,
      detail: {
        documentTitle: '图书馆 - Klog',
        drawer: 'off',
        mainMenu: false,
        sidebar: 'off',
        header: {
          fixed: true,
          short: false,
          shadow: 'scroll'
        },
        styles: {
          '--klog-header-background': 'var(--primary-background-color)',
          '--klog-header-text-color': 'var(--primary-text-color)',
        },
        toolbar: html`
              <app-toolbar>
                <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
                <div class="title">
                  <div main-title><iron-icon icon="klog"></iron-icon></div>
                  <div class="divider"></div>
                  <div page-title>大书库</div>
                </div>
              </app-toolbar>`
      }
    }));
  }

  ready() {
    super.ready();
    gapi.load('client:auth2', () => this.initClient());
    this.$.authorizeButton.addEventListener('click', () => {
      gapi.auth2.getAuthInstance().signIn();
    });
    this.$.signoutButton.addEventListener('click', () => {
      gapi.auth2.getAuthInstance().signOut();
    });
  }

  initClient() {
    var CLIENT_ID = '692627325753-q1r4lcujk2lfjfndc6jio2n79b7bt6fp.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyAJSo8iu0NW39zOSyH7Sy9fu8uOFp6FFEQ';
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => this.updateSigninStatus(isSignedIn));
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) => {
      this.appendPre(JSON.stringify(error, null, 2));
    });
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.$.authorizeButton.style.display = 'none';
      this.$.signoutButton.style.display = 'block';
      this.listFiles();
    } else {
      this.$.authorizeButton.style.display = 'block';
      this.$.signoutButton.style.display = 'none';
    }
  }

  appendPre(message) {
    var pre = this.$.content;
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  listFiles() {
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then((response) => {
      this.appendPre('Files:');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          this.appendPre(file.name + ' (' + file.id + ')');
        }
      } else {
        this.appendPre('No files found.');
      }
    });
  }
}

window.customElements.define(KlogAppsLib.is, KlogAppsLib);

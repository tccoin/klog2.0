import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../ui/klog-menu-button.js';
import '../style/klog-style-scrollbar.js';
const KlogEmoticonSelector = document.createElement('template');

KlogEmoticonSelector.innerHTML = `<dom-module id="klog-emoticon-selector">
  <template>
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: inline;
      }
      .emoticon-container {
        max-width: 350px;
        height: 100px;
        overflow: auto;
        padding: 16px 10px;
        cursor: default;
        text-align: justify;
      }
      .emoticon-item {
        padding: 2px 6px;
        white-space: nowrap;
        cursor: pointer;
        display: inline-block;
        transition: transform .1s ease;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      .emoticon-item:hover {
        transform: scale(1.25);
      }
    </style>

    <klog-menu-button>
    <div slot="dropdown-trigger"><slot></slot></div>
    <div class="emoticon-container" slot="dropdown-content" on-click="_select">
      <template is="dom-repeat" items="{{emoticonList}}">
        <span class="emoticon-item">{{item}}</span>
      </template>
    </div>
  </klog-menu-button>

  </template>


</dom-module>`;

document.head.appendChild(KlogEmoticonSelector.content);
class KlogFab extends PolymerElement {

  static get is() { return 'klog-emoticon-selector'; }

  static get properties() {
    return {
      emoticonList: {
        type: Array,
        value: [
          '⊂彡☆))д`)', '|∀ﾟ', '(´ﾟДﾟ`)', '(;´Д`)', '(｀･ω･)', '(=ﾟωﾟ)=', '| ω・´)', '|-` )', '|д` )', '|ー` )',
          '|∀` )', 'σ`∀´)', 'ﾟ∀ﾟ)σ', '(・ー・)', '(・∀・)', '(ゝ∀･)', '(〃∀〃)', '(つд⊂)', '(ﾟДﾟ≡ﾟДﾟ)', 'Σ( ﾟдﾟ)',
          '( ;ﾟдﾟ)', '( ;´д`)', '(　д ) ﾟ ﾟ', '(＾o＾)ﾉ', '(|||ﾟДﾟ)', '( ﾟ∀ﾟ)', '( ´∀`)', '(*´∀`)', '(*ﾟ∇ﾟ)',
          '(*ﾟーﾟ)', '(　ﾟ 3ﾟ)', '( ´ー`)', '( ・_ゝ・)', '( ´_ゝ`)', '(*´д`)', '(*ﾟ∀ﾟ*)', '( ﾟ∀。)', '( `д´)',
          '(`ε´ )', '(`ヮ´ )', 'ﾟ ∀ﾟ)ノ', '(╬ﾟдﾟ)', '(|||ﾟдﾟ)', '( ﾟдﾟ)', '( ☉д⊙)', '(((　ﾟдﾟ)))', '( ` ・´)',
          '( ´д`)', '( -д-)', '(>д<)', '･ﾟ( ﾉд`ﾟ)', '( TдT)', '(￣∇￣)', '(￣3￣)', '(￣ｰ￣)', '(￣ . ￣)', '(￣皿￣)',
          '(￣艸￣)', '(￣︿￣)', '(￣︶￣)', 'ヾ(´ωﾟ｀)', '(*´ω`*)', '(・ω・)', '( ´・ω)', '(｀・ω)', '(´・ω・`)',
          '(`・ω・´)', '( `_っ´)', '( `ー´)', '( ´_っ`)', '( ´ρ`)', '( ﾟωﾟ)', '(oﾟωﾟo)', '(　^ω^)', '(｡◕∀◕｡)',
          '/( ◕‿‿◕ )\\', 'ヾ(´ε`ヾ)', '(ノﾟ∀ﾟ)ノ', '(σﾟдﾟ)σ', '(σﾟ∀ﾟ)σ', '|дﾟ )', '┃電柱┃', 'ﾟ(つд`ﾟ)', 'ﾟÅﾟ )',
          '⊂彡☆))д´)', '⊂彡☆))∀`)'
        ]
      }
    }
  }

  _select(e) {
    if (e.target.classList.contains('emoticon-item')) {
      this.dispatchEvent(new CustomEvent('emoticon-select', {
        bubbles: true,
        composed: true,
        detail: { emoticon: e.target.innerText }
      }));
    }
  }

}
window.customElements.define(KlogFab.is, KlogFab);
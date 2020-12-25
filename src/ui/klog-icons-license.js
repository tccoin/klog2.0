import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
const containerKlogIconsLicense = document.createElement('template');

containerKlogIconsLicense.innerHTML = `
<iron-iconset-svg name="license" size="24">
<svg><defs>
<g id="by"><path d="M12,3c2.5,0,4.7,0.9,6.4,2.6C20.1,7.4,21,9.5,21,12c0,2.5-0.9,4.6-2.6,6.3c-1.8,1.8-4,2.7-6.4,2.7c-2.4,0-4.5-0.9-6.3-2.7 C3.9,16.6,3,14.5,3,12c0-2.5,0.9-4.6,2.7-6.4C7.4,3.9,9.5,3,12,3z M12,4.6c-2,0-3.8,0.7-5.2,2.2C5.4,8.3,4.6,10,4.6,12 c0,2,0.7,3.7,2.2,5.2c1.5,1.5,3.2,2.2,5.2,2.2c2,0,3.8-0.7,5.2-2.2c1.4-1.4,2.1-3.1,2.1-5.2c0-2-0.7-3.8-2.2-5.2 C15.8,5.3,14.1,4.6,12,4.6z M14.4,9.8v3.7h-1v4.4h-2.8v-4.4h-1V9.8c0-0.2,0.1-0.3,0.2-0.4c0.1-0.1,0.2-0.2,0.4-0.2h3.7 c0.1,0,0.3,0.1,0.4,0.2C14.4,9.5,14.4,9.6,14.4,9.8z M10.8,7.5c0-0.8,0.4-1.3,1.3-1.3s1.3,0.4,1.3,1.3c0,0.8-0.4,1.3-1.3,1.3 S10.8,8.3,10.8,7.5z"/> </g>
<g id="all"><path d="M14.7,14.2L14.5,14c-0.5,0.6-1.3,1-2.2,1c-1.6,0-3-1.3-3-3c0-1.6,1.3-3,3-3c0.9,0,1.7,0.4,2.2,1l0.2-0.1l1.6-1 c-0.9-1.2-2.4-2-4-2c-2.8,0-5.1,2.3-5.1,5.1s2.3,5.1,5.1,5.1c1.6,0,3.1-0.8,4-2L14.7,14.2z"/> <path d="M12,3c2.5,0,4.7,0.9,6.4,2.6c0.8,0.8,1.5,1.8,1.9,2.9C20.8,9.6,21,10.8,21,12c0,1.2-0.2,2.4-0.7,3.5 c-0.4,1.1-1.1,2-1.9,2.9c-0.9,0.9-1.9,1.5-3,2C14.3,20.8,13.2,21,12,21s-2.3-0.2-3.4-0.7c-1.1-0.5-2.1-1.1-2.9-2 c-0.9-0.9-1.5-1.8-2-2.9S3,13.2,3,12c0-1.2,0.2-2.3,0.7-3.4s1.1-2.1,2-2.9C7.4,3.9,9.5,3,12,3z M12,4.6c-2.1,0-3.8,0.7-5.2,2.2 C6.1,7.5,5.6,8.3,5.2,9.2C4.8,10.1,4.6,11,4.6,12c0,1,0.2,1.9,0.6,2.8c0.4,0.9,0.9,1.7,1.6,2.4c0.7,0.7,1.5,1.2,2.4,1.6 c0.9,0.4,1.8,0.6,2.8,0.6c1,0,1.9-0.2,2.8-0.6c0.9-0.4,1.7-0.9,2.5-1.6c1.4-1.4,2.1-3.1,2.1-5.2c0-1-0.2-1.9-0.5-2.8 c-0.4-0.9-0.9-1.7-1.6-2.4C15.8,5.4,14.1,4.6,12,4.6z"/> </g>
<g id="zero"> <path id="text2809_1_" d="M12,6.8c-3,0-3.7,2.8-3.7,5.2c0,2.4,0.7,5.2,3.7,5.2c3,0,3.7-2.8,3.7-5.2C15.7,9.6,15,6.8,12,6.8z M12,8.8c0.1,0,0.2,0,0.3,0c0.2,0.2,0.3,0.4,0.1,0.8l-2,3.6c-0.1-0.5-0.1-0.9-0.1-1.2C10.4,11,10.5,8.8,12,8.8z M13.5,10.5 c0.1,0.6,0.1,1.1,0.1,1.6c0,1-0.1,3.2-1.6,3.2c-0.1,0-0.2,0-0.3,0c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0c-0.3-0.1-0.6-0.4-0.2-0.9 L13.5,10.5z"/> <path id="path2815_1_" d="M12,3C9.5,3,7.4,3.9,5.7,5.6c-0.9,0.9-1.5,1.9-2,3C3.2,9.7,3,10.8,3,12c0,1.2,0.2,2.3,0.7,3.4 c0.4,1.1,1.1,2.1,2,2.9c0.9,0.9,1.8,1.5,2.9,2C9.7,20.8,10.8,21,12,21c1.2,0,2.3-0.2,3.5-0.7c1.1-0.5,2.1-1.1,3-2 c0.8-0.8,1.5-1.8,1.9-2.8c0.4-1.1,0.7-2.2,0.7-3.5c0-1.2-0.2-2.4-0.7-3.5c-0.4-1.1-1.1-2.1-1.9-2.9C16.7,3.9,14.5,3,12,3z M12,4.6 c2,0,3.8,0.7,5.2,2.2c0.7,0.7,1.2,1.5,1.6,2.4c0.4,0.9,0.5,1.8,0.5,2.8c0,2.1-0.7,3.8-2.1,5.2c-0.7,0.7-1.5,1.3-2.5,1.6 c-0.9,0.4-1.8,0.6-2.8,0.6c-1,0-1.9-0.2-2.8-0.5c-0.9-0.4-1.7-0.9-2.4-1.6c-0.7-0.7-1.3-1.5-1.6-2.4C4.8,13.9,4.6,13,4.6,12 c0-1,0.2-1.9,0.6-2.8c0.4-0.9,0.9-1.7,1.6-2.4C8.2,5.3,10,4.6,12,4.6z"/> </g>
<g id="nc"> <path d="M12,3c2.5,0,4.7,0.9,6.4,2.6C20.1,7.3,21,9.5,21,12c0,2.5-0.9,4.6-2.6,6.3c-1.8,1.8-4,2.7-6.4,2.7c-2.4,0-4.6-0.9-6.3-2.7 C3.9,16.6,3,14.5,3,12c0-2.5,0.9-4.6,2.7-6.4C7.4,3.9,9.5,3,12,3z M5,9.6c-0.3,0.7-0.4,1.5-0.4,2.4c0,2,0.7,3.7,2.2,5.2 c1.5,1.4,3.2,2.2,5.2,2.2c2,0,3.8-0.7,5.2-2.2c0.5-0.5,0.9-1,1.2-1.6l-3.4-1.5c-0.1,0.6-0.4,1-0.9,1.4c-0.5,0.4-1,0.6-1.6,0.6v1.4 h-1v-1.4c-1,0-1.9-0.4-2.7-1.1l1.2-1.3c0.6,0.5,1.3,0.8,2,0.8c0.3,0,0.6-0.1,0.8-0.2c0.2-0.1,0.3-0.4,0.3-0.7 c0-0.2-0.1-0.4-0.2-0.5l-0.9-0.4l-1.1-0.5l-1.4-0.6L5,9.6z M12,4.6c-2,0-3.8,0.7-5.2,2.2C6.5,7.1,6.1,7.5,5.8,8l3.4,1.5 c0.1-0.5,0.4-0.8,0.9-1.1C10.5,8.1,11,8,11.6,7.9V6.5h1v1.4c0.8,0,1.6,0.3,2.2,0.8L13.7,10c-0.5-0.4-1-0.5-1.5-0.5 c-0.3,0-0.5,0.1-0.7,0.2c-0.2,0.1-0.3,0.3-0.3,0.5c0,0.1,0,0.1,0.1,0.2l1.1,0.5l0.8,0.4l1.4,0.6l4.6,2.1c0.2-0.6,0.2-1.3,0.2-1.9 c0-2.1-0.7-3.8-2.2-5.2C15.8,5.3,14.1,4.6,12,4.6z"/> </g>
<g id="sa"> <path d="M12,3c2.5,0,4.6,0.9,6.4,2.6C20.1,7.4,21,9.5,21,12c0,2.5-0.9,4.6-2.6,6.3c-1.8,1.8-4,2.7-6.4,2.7c-2.4,0-4.5-0.9-6.3-2.7 C3.9,16.6,3,14.5,3,12c0-2.5,0.9-4.6,2.7-6.4C7.4,3.9,9.5,3,12,3z M12,4.6c-2,0-3.8,0.7-5.2,2.2C5.4,8.3,4.6,10,4.6,12 c0,2,0.7,3.7,2.2,5.2c1.5,1.5,3.2,2.2,5.2,2.2c2,0,3.8-0.7,5.2-2.2c1.4-1.4,2.1-3.1,2.1-5.2c0-2.1-0.7-3.8-2.2-5.2 C15.8,5.4,14.1,4.6,12,4.6z M8,10.7c0.2-1.1,0.6-2,1.3-2.6c0.7-0.6,1.6-0.9,2.6-0.9c1.4,0,2.5,0.5,3.4,1.4 c0.8,0.9,1.3,2.1,1.3,3.5c0,1.4-0.4,2.5-1.3,3.4c-0.9,0.9-2,1.4-3.4,1.4c-1,0-1.9-0.3-2.6-0.9c-0.7-0.6-1.2-1.5-1.3-2.6h2.3 c0.1,1.1,0.7,1.6,2,1.6c0.6,0,1.1-0.3,1.5-0.8c0.4-0.5,0.6-1.3,0.6-2.2c0-1-0.2-1.7-0.5-2.2c-0.4-0.5-0.9-0.7-1.5-0.7 c-1.2,0-1.9,0.5-2,1.6h0.7l-1.8,1.8l-1.8-1.8L8,10.7L8,10.7z"/> </g>
<g id="nd"> <path d="M12,3c2.5,0,4.6,0.9,6.4,2.6C20.1,7.4,21,9.5,21,12s-0.9,4.6-2.6,6.3c-1.8,1.8-4,2.7-6.4,2.7c-2.4,0-4.5-0.9-6.3-2.7 C3.9,16.6,3,14.5,3,12c0-2.5,0.9-4.6,2.7-6.4C7.4,3.9,9.5,3,12,3z M12,4.6c-2,0-3.8,0.7-5.2,2.2C5.4,8.3,4.6,10,4.6,12 c0,2,0.7,3.7,2.2,5.2c1.5,1.5,3.2,2.2,5.2,2.2c2,0,3.7-0.7,5.2-2.2c1.4-1.4,2.1-3.1,2.1-5.2c0-2.1-0.7-3.8-2.2-5.2 C15.8,5.4,14.1,4.6,12,4.6z M15.4,9.9v1.5H8.9V9.9H15.4z M15.4,12.8v1.5H8.9v-1.5H15.4z"/> </g>
<g id="cc"> <path d="M12,3c2.5,0,4.7,0.9,6.4,2.6c0.8,0.8,1.5,1.8,1.9,2.9C20.8,9.6,21,10.8,21,12c0,1.2-0.2,2.4-0.7,3.5 c-0.4,1.1-1.1,2-1.9,2.9c-0.9,0.9-1.9,1.5-3,2C14.3,20.8,13.2,21,12,21s-2.3-0.2-3.4-0.7c-1.1-0.5-2.1-1.1-2.9-2 c-0.9-0.9-1.5-1.8-2-2.9S3,13.2,3,12c0-1.2,0.2-2.3,0.7-3.4s1.1-2.1,2-2.9C7.4,3.9,9.5,3,12,3z M12,4.6c-2.1,0-3.8,0.7-5.2,2.2 C6.1,7.5,5.6,8.3,5.2,9.2C4.8,10.1,4.6,11,4.6,12c0,1,0.2,1.9,0.6,2.8c0.4,0.9,0.9,1.7,1.6,2.4c0.7,0.7,1.5,1.2,2.4,1.6 c0.9,0.4,1.8,0.6,2.8,0.6c1,0,1.9-0.2,2.8-0.6c0.9-0.4,1.7-0.9,2.5-1.6c1.4-1.4,2.1-3.1,2.1-5.2c0-1-0.2-1.9-0.5-2.8 c-0.4-0.9-0.9-1.7-1.6-2.4C15.8,5.4,14.1,4.6,12,4.6z M11.9,10.5l-1.2,0.6c-0.1-0.3-0.3-0.5-0.5-0.6c-0.2-0.1-0.4-0.2-0.5-0.2 c-0.8,0-1.2,0.5-1.2,1.6c0,0.5,0.1,0.9,0.3,1.2c0.2,0.3,0.5,0.4,0.9,0.4c0.5,0,0.9-0.3,1.1-0.8l1.1,0.6c-0.2,0.4-0.6,0.8-1,1 c-0.4,0.3-0.9,0.4-1.4,0.4c-0.8,0-1.5-0.2-1.9-0.7c-0.5-0.5-0.7-1.2-0.7-2.1c0-0.9,0.2-1.5,0.7-2c0.5-0.5,1.1-0.8,1.9-0.8 C10.6,9.2,11.4,9.6,11.9,10.5z M17.1,10.5l-1.2,0.6c-0.1-0.3-0.3-0.5-0.5-0.6c-0.2-0.1-0.4-0.2-0.5-0.2c-0.8,0-1.2,0.5-1.2,1.6 c0,0.5,0.1,0.9,0.3,1.2c0.2,0.3,0.5,0.4,0.9,0.4c0.5,0,0.9-0.3,1.1-0.8l1.1,0.6c-0.2,0.4-0.6,0.8-1,1c-0.4,0.3-0.9,0.4-1.4,0.4 c-0.8,0-1.5-0.2-2-0.7c-0.5-0.5-0.7-1.2-0.7-2.1c0-0.9,0.2-1.5,0.7-2c0.5-0.5,1.1-0.8,1.9-0.8C15.8,9.2,16.6,9.6,17.1,10.5z"/> </g>
</defs></svg>
</iron-iconset-svg>`;

document.head.appendChild(containerKlogIconsLicense.content);
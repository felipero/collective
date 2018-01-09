/*eslint-env browser*/

import "./stylesheets/main.scss";

const m = new Map();
m.set('greeting', 'Hello').set('name', 'es2015');

const p = document.createElement('p');
p.innerHTML = m.get('greeting') + ', ' + m.get('name');
document.body.appendChild(p);

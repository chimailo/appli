import _ from 'lodash';
import './style.scss';
import Img from './img.jpg';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Img;

  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());

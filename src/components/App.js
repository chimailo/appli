import React from 'react';
import Hello from './Hello';
import ImgReact from '../images/react.svg';
import ImgBabel from '../images/babel.svg';
import Imgwebpack from '../images/webpack.svg';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-lib">
          <img src={Imgwebpack} className="App-logo" alt="webpack-logo" />
          <img src={ImgBabel} className="App-logo" alt="babel-logo" />
          <img src={ImgReact} className="App-logo" alt="react-logo" />
        </div>
        <Hello />
      </header>
    </div>
  );
}

export default App;

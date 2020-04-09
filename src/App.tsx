import * as React from 'react';
import ImgReact from './assets/react.svg';
import ImgBabel from './assets/babel.svg';
import Imgwebpack from './assets/webpack.svg';
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
        <h1>Hello There!</h1>
      </header>
    </div>
  );
}

export default App;

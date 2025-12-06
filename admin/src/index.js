import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('library-manager-root');

if (root) {
    ReactDOM.render(<App />, root);
}
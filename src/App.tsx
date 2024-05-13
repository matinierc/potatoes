import React from "react";
import Helmet from 'react-helmet';


import "./App.css";
import SpotifyProvider from "./providers/PotatoesProvider";
import PlaylistData from "./components/PlaylistData";
import Controls from "./components/Controls";

const App = () => {
  return (
    <div className="App">
      <Helmet>
        <script src="https://open.spotify.com/embed/iframe-api/v1" type="text/javascript" async />
      </Helmet>
      <div className="App-body">
        <SpotifyProvider>
          <div className="header">
            <Controls />
            <div id="embed-iframe"></div>
          </div>
          <PlaylistData />
        </SpotifyProvider>
      </div>
    </div>
  );
};

export default App;


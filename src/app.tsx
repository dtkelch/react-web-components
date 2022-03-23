import React from "react";
import { FetchData } from "./fetch-data";

export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        Welcome to our application!
        <FetchData name="Daniel 2a" />
      </header>
    </div>
  );
};

import { useEffect } from "react";
import "./App.css";


function App() {
  useEffect(() => {
    fetch("http://localhost:3000/game/state")
      .then((res) => res.json())
      .then((data) => {
        console.log("현재 보드 상태:", data);
      });
  }, []);

  return (
    <>
     
    </>
  );
}

export default App;

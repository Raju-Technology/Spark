import React from "react"
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const handleScanModeClick = () => {
        navigate("/scan");
      };
    return(
        <div>
            <h1>SPARK!</h1>
            <h4>YOUR ALZHEIMER'S COMPANION</h4>
            <button onClick={handleScanModeClick}>Scan Mode</button>
        </div>
    )
}

export default Home
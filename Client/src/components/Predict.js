import React, { useState } from "react";
import Button from "@mui/material/Button";

function Predict() {
    const [selectedButton, setSelectedButton] = useState(null);

    function handleClick(button) {
        setSelectedButton(button);
    }

    let displayButtons = null;
    if (!selectedButton) {
        displayButtons = (
            <div>
                <Button onClick={() => handleClick("team1")} variant="contained">
                    Team 1
                </Button>
                <Button onClick={() => handleClick("tie")} variant="contained">
                    Tie
                </Button>
                <Button onClick={() => handleClick("team2")} variant="contained">
                    Team 2
                </Button>
            </div>
        );
    } else if (selectedButton === "team1") {
        displayButtons = (
            <div>
                <Button onClick={() => handleClick("team2")} variant="contained">
                    Team 2
                </Button>
                <Button onClick={() => handleClick("tie")} variant="contained">
                    Tie
                </Button>
            </div>
        );
    } else if (selectedButton === "team2") {
        displayButtons = (
            <div>
                <Button onClick={() => handleClick("team1")} variant="contained">
                    Team 1
                </Button>
                <Button onClick={() => handleClick("tie")} variant="contained">
                    Tie
                </Button>
            </div>
        );
    } else if (selectedButton === "tie") {
        displayButtons = (
            <div>
                <Button onClick={() => handleClick("team1")} variant="contained">
                    Team 1
                </Button>
                <Button onClick={() => handleClick("team2")} variant="contained">
                    Team 2
                </Button>
            </div>
        );
    }

    return <div>{displayButtons}</div>;
}

export default Predict;

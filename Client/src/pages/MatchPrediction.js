import { useState, useEffect } from "react";

import { Grid, Button } from "@material-ui/core";

const MatchPrediction = ({ matchData }) => {
  const [match, setMatch] = useState({
    team1: matchData && matchData.teams && matchData.teams[0],
    team2: matchData && matchData.teams && matchData.teams[1],
    predictions: {
      team1: [],
      team2: [],
      tie: [],
    },
  });

  let [team1Percent, setTeam1Percent] = useState(0);
  let [team2Percent, setTeam2Percent] = useState(0);
  let [tiePercent, setTiePercent] = useState(0);
  const [team1Clicked, setTeam1Clicked] = useState(false);
  const [team2Clicked, setTeam2Clicked] = useState(false);
  const [tieClicked, setTieClicked] = useState(false);

  useEffect(() => {
    // Calculate percentages
    const totalPredictions =
      match.predictions.team1.length + match.predictions.team2.length + match.predictions.tie.length;
    if (totalPredictions > 0) {
      const team1Percent = (match.predictions.team1.length / totalPredictions) * 100;
      const team2Percent = (match.predictions.team2.length / totalPredictions) * 100;
      const tiePercent = (match.predictions.tie.length / totalPredictions) * 100;
      setTeam1Percent(team1Percent.toFixed(2));
      setTeam2Percent(team2Percent.toFixed(2));
      setTiePercent(tiePercent.toFixed(2));
    }
  }, [match]);

  team1Percent = team1Percent + "%";
  team2Percent = team2Percent + "%";
  tiePercent = tiePercent + "%";

  const handlePrediction = (prediction) => {
    // Update match predictions in the state
    const updatedPredictions = { ...match.predictions };
    const selectedOption = updatedPredictions[prediction];
    const otherOptions = Object.keys(updatedPredictions).filter((option) => option !== prediction);
    updatedPredictions[prediction] = [...selectedOption, true];
    otherOptions.forEach((option) => {
      updatedPredictions[option] = updatedPredictions[option].filter((item) => item !== true);
    });
    const updatedMatch = {
      ...match,
      predictions: updatedPredictions,
    };
    setMatch(updatedMatch);
    if (prediction === "team1") {
      setTeam1Clicked(true);
      setTeam2Clicked(false);
      setTieClicked(false);
    } else if (prediction === "team2") {
      setTeam1Clicked(false);
      setTeam2Clicked(true);
      setTieClicked(false);
    } else {
      setTeam1Clicked(false);
      setTeam2Clicked(false);
      setTieClicked(true);
    }
  };

  return (
    <div>
      <p>
        <strong>Result Prediction</strong>
      </p>
      <Grid container justifyContent="center">
        {!team1Clicked && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePrediction("team1")}
            style={{ marginRight: "10px" }}
          >
            {match.team1 + " " + team1Percent}
          </Button>
        )}

        {!tieClicked && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handlePrediction("tie")}
            style={{ marginRight: "10px" }}
          >
            Tie {tiePercent}
          </Button>
        )}

        {!team2Clicked && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePrediction("team2")}
            style={{ marginRight: "10px" }}
          >
            {match.team2 + " " + team2Percent}
          </Button>
        )}
      </Grid>
      <div>
        {match.predictions.team1.length > 0 && (
          <p>
            {match.predictions.team1.length} predictions for {match.team1} ({team1Percent}%)
          </p>
        )}
        {match.predictions.team2.length > 0 && (
          <p>
            {match.predictions.team2.length} predictions for {match.team2} ({team2Percent}%)
          </p>
        )}

        {match.predictions.tie.length > 0 && (
          <p>
            {match.predictions.tie.length} predictions for Tie ({tiePercent}%)
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchPrediction;

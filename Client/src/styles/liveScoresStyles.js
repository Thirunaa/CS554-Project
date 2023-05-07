import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  item: {
    flex: "5%",
    height: "100%",
    backgroundColor: "rgb(0, 0, 0, 0.6)",
    display: "grid",
    placeItems: "center",
    color: "white",
    cursor: "pointer",
  },

  carousel: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});

export { useStyles };

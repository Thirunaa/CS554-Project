import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  card: {
    width: '100%',
    height: 150,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    border: '1px bold #ccc',
  },
  card1: {
    width: '80%',
    height: 100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    
  },
  section: {
    flex: 1,
    padding: 14,
  },
  divider: {
    height: '80%',
    margin: '0 8px',
  },
  page:{
    display: "inline-block",
    boxsizing: "border-box",
    float: "center",
    height: "100%"
  }
 
});

 export { useStyles };

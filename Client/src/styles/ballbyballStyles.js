import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  card: {
    width: '80%',
    height: 100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    border: '1px bold #ccc',
  },
  section: {
    flex: 1,
    padding: 14,
  },
  divider: {
    height: '80%',
    margin: '0 8px',
  },
 
});

 export { useStyles };

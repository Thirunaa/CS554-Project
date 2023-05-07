import React, { useContext, useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import { doChangePassword } from '../firebase/FirebaseFunctions';
import {
    TextField,
    Button,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 'auto',
        maxWidth: 400,
        padding: theme.spacing(4),
    },
    title: {
        marginBottom: theme.spacing(4),
    },
    submitButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function ChangePassword() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const classes = useStyles();

    const submitForm = async (event) => {
        event.preventDefault();
        const { currentPassword, newPasswordOne, newPasswordTwo } =
            event.target.elements;

        if (newPasswordOne.value !== newPasswordTwo.value) {
            setPwMatch('New passwords do not match, please try again');
            return false;
        }

        try {
            await doChangePassword(
                currentUser.email,
                currentPassword.value,
                newPasswordOne.value
            );
            alert('Password has been changed, you will now be logged out');
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser && currentUser.providerData[0].providerId === 'password') {
        return (
            <div className={classes.root}>
                {pwMatch && (
                    <Typography variant='subtitle2' color='error'>
                        {pwMatch}
                    </Typography>
                )}
                <Typography variant='h4' className={classes.title}>
                    Change Password
                </Typography>
                <form onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin='normal'
                                label='Current Password'
                                type='password'
                                name='currentPassword'
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin='normal'
                                label='New Password'
                                type='password'
                                variant="outlined"
                                name='newPasswordOne'
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin='normal'
                                label='Confirm New Password'
                                type='password'
                                variant="outlined"
                                name='newPasswordTwo'
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                className={classes.submitButton}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <br />
            </div>
        );
    }
}

export default ChangePassword;

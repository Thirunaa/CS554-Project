import { useState } from 'react';
import { Container, Avatar, Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import ChangePassword from '../components/ChangePassword';
import { Navigate } from "react-router-dom";

const profile = {
    displayName: 'Thaarani',
    email: 'thaarani061997@gmail.com',
    favplayers: ['Messi', 'Ronaldo', 'Neymar', 'Dhoni', 'Virat'],
    savedmatches: ['Barcelona vs Real Madrid', 'Manchester United vs Manchester City'],
};

const ProfilePage = () => {
    const { displayName, email, favplayers, savedmatches } = profile;
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handlePasswordReset = () => {
        setShowChangePassword(true);
    };

    if (showChangePassword) {
        return <Navigate to="/change-password" />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 100, height: 100, mr: 2 }}>{displayName.charAt(0)}</Avatar>
                    <div>
                        <Typography variant="h5" >
                            {displayName}
                        </Typography>
                        <Typography color="textSecondary" >
                            {email}
                        </Typography>
                    </div>
                </CardContent>
                <CardContent>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handlePasswordReset}>
                            Change Password
                        </Button>
                    </Grid>
                </CardContent>
            </Card>

            <Grid item xs={12}>
                <Box component="section" sx={{ border: '1px solid #ccc', borderRadius: '5px', p: 2, mb: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Favorite Players
                    </Typography>
                    <Grid container spacing={2}>
                        {profile.favplayers.map((player) => (
                            <Grid item key={player} xs={12} sm={6} md={4}>
                                <Card sx={{ backgroundColor: '#F5F5F5', p: 1 }}>
                                    <CardContent>
                                        <Typography>{player}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box component="section" sx={{ border: '1px solid #ccc', borderRadius: '5px', p: 2, mb: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Saved Matches
                    </Typography>
                    <Grid container spacing={2}>
                        {profile.savedmatches.map((match) => (
                            <Grid item key={match} xs={12} sm={6} md={4}>
                                <Card sx={{ backgroundColor: '#EFEFEF', p: 1 }}>
                                    <CardContent>
                                        <Typography>{match}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
        </Container>
    );
};

export default ProfilePage;

import React from 'react';

//Image
import playLayout from '../assets/playLayout.png';

//Material UI components
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        backgroundColor: '#e8eaf6',
        marginBottom: 150,
        height: 880
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },

    videoFrame: {
        width: '100%',
        height: 400,
        marginBottom: 20,
    },

    subtitle: {
        fontWeight: 'bold',
    },

}));

const BlankMediaPlayer = () => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <img src={playLayout} alt="Player Layout" className={classes.videoFrame} />

                    <Typography variant="h5" gutterBottom>
                        Driver: 
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Plate #: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Address: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Type: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Latitude: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Longitude: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Time: </span>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Description: </span>
                    </Typography>
               
                </CardContent>

            </div>
        </Card>
    );
}

export default BlankMediaPlayer;

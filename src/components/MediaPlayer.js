import React from 'react';

//Image
// import playLayout from '../assets/playLayout.png';

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

const MediaPlayer = (props) => {
    const classes = useStyles();
    const selectedData = props.selectedData;
    
    const TypeConvert = () => {
        switch (selectedData.type) {
            case 'P':
                return '(P)Pothole paved surface';
            case 'PN':
                return '(PN)Pothole non-paved';
            case 'PS':
                return '(PS)Pothole shoulder';
            case 'SD':
                return '(SD)Shoulder Drop-off';
            case 'C':
                return '(C)Crack';
            case 'D':
                return '(D)Debris';
            case 'B':
                return '(B)Bridge Deck Spall';
            case 'RD':
                return '(RD)Road Discontinuity';
            default:
                return 'No Type Selected';
        }
    }

    return (
        <Card className={classes.card}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    {/* <iframe
                        className={classes.videoFrame}
                        src={selectedData.url}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe> */}
                    <video 
                        key={selectedData.url}
                        className={classes.videoFrame} 
                        controls 
                        autoPlay
                        >
                        <source src={selectedData.url} type="video/mp4" />
                        Your browser does not support HTML5 video.
                    </video>

                    <Typography variant="h5" gutterBottom>
                        Driver: {selectedData.driver}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Plate #: </span>{selectedData.plate}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Address: </span>{selectedData.address}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Type: </span><TypeConvert />
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Latitude: </span>{selectedData.latitude}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Longitude: </span>{selectedData.longitude}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Time: </span>{selectedData.timeText}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <span className={classes.subtitle}>Description: </span>
                    </Typography>
                    <Typography variant="body1">
                        {selectedData.description}
                    </Typography>
                </CardContent>

            </div>
        </Card>
    );
}

export default MediaPlayer;

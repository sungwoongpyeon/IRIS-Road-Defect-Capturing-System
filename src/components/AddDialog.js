import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = theme => ({
    buttonArea: {
        marginBottom: 10,
    },

});

class AddDialog extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Dialog fullWidth open={this.props.dialog} onClose={this.props.handleDialogToggle}>
                <DialogTitle>Add Information</DialogTitle>
                <DialogContent>
                    <InputLabel id="demo-simple-select-outlined-label">Defect Type</InputLabel>
                    <Select
                        fullWidth
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name="type"
                        value={this.props.type}
                        onChange={event => this.props.handleChange(event.target.value)}
                    >
                        <MenuItem value="P">(P)Pothole paved surface</MenuItem>
                        <MenuItem value="PN">(PN)Pothole non-paved</MenuItem>
                        <MenuItem value="PS">(PS)Pothole shoulder</MenuItem>
                        <MenuItem value="SD">(SD)Shoulder Drop-off</MenuItem>
                        <MenuItem value="C">(C)Crack</MenuItem>
                        <MenuItem value="D">(D)Debris</MenuItem>
                        <MenuItem value="B">(B)Bridge Deck Spall</MenuItem>
                        <MenuItem value="RD">(RD)Road Discontinuity</MenuItem>
                    </Select><br />
                    <TextField fullWidth label="Address" type="text" name="address" value={this.props.address} onChange={this.props.handleValueChange} /><br />
                    <TextField fullWidth label="Driver" type="text" name="driver" value={this.props.driver} onChange={this.props.handleValueChange} /><br />
                    <TextField fullWidth label="Plate" type="text" name="plate" value={this.props.plate} onChange={this.props.handleValueChange} /><br />
                    <TextField
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        label="Time"
                        type="date"
                        name="timeText"
                        value={this.props.timeText}
                        onChange={this.props.handleValueChange}
                    /><br />
                    <TextField
                        fullWidth
                        label="Desctiption"
                        type="text"
                        name="description"
                        value={this.props.description}
                        onChange={this.props.handleValueChange}
                        multiline
                        rows="4"
                    /><br />

                </DialogContent>

                <DialogContent>
                    <Button fullWidth className={classes.buttonArea} variant="contained" color="primary" onClick={this.props.handleSubmit}>Add</Button>
                    <Button fullWidth className={classes.buttonArea} variant="outlined" color="primary" onClick={this.props.handleDialogToggle}>Close</Button>
                </DialogContent>

            </Dialog>
        );
    }
}

export default withStyles(useStyles)(AddDialog);
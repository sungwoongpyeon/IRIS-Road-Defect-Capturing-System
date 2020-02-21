import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

class DataItem extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    //function goes here
    render() {

        return (
            //style={{backgroundColor:'red', color: 'white'}}
            <TableRow
                style={
                    this.props.isActive === this.props.index ? { backgroundColor: '#3F51B5', color: 'white' } : {}
                }
            >
                <TableCell align="center" >
                    <IconButton style={
                        this.props.isActive === this.props.index ? { color: 'white' } : { color: '#3F51B5' } } aria-label="edit" onClick={this.props.edit}>
                        <EditIcon
                            size="medium"
                        />
                    </IconButton>
                    <IconButton style={
                        this.props.isActive === this.props.index ? { color: 'white' } : { color: '#3F51B5' }} aria-label="delete" onClick={this.props.delete}>
                        <DeleteIcon
                            size="medium"
                        />
                    </IconButton>
                    {this.props.url ?
                        <IconButton style={
                            this.props.isActive === this.props.index ? { color: 'white' } : { color: '#3F51B5' }} aria-label="play" onClick={this.props.play}>
                            <PlayArrowIcon
                                size="medium"
                            />
                        </IconButton> : ""}
                </TableCell >
                
                <TableCell style={
                    this.props.isActive === this.props.index ? { color: 'white' } : {}
                } align="center">{this.props.type}</TableCell >

                <TableCell style={
                    this.props.isActive === this.props.index ? { color: 'white' } : {}
                } align="center">{this.props.pci}</TableCell >
                
                <TableCell style={
                    this.props.isActive === this.props.index ? { color: 'white' } : {}
                } align="center">{this.props.date_time}</TableCell >
            </TableRow >
        );
    }
}

export default DataItem
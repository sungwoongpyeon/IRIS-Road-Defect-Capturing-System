import React from 'react';
import DataItem from './DataItem';
import AddDialog from './AddDialog';
import EditDialog from './EditDialog';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = theme => ({
    
});

class DataTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    render() {
        const { classes } = this.props;
        if (this.props.loading) {
            return <p>Loading...</p>
        }
        return (
            <>
                
            </>
        );
    }
}

export default withStyles(useStyles)(DataTable);
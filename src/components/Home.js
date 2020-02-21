
import React from 'react';
import Header from './Header';

// Google Map
import MyMap from './MyMap';

//Material UI components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import DataItem from './DataItem';
import AddDialog from './AddDialog';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
// import EditDialog from './EditDialog';
import { CircularProgress } from '@material-ui/core';

// import app from '../config/firebase'

const useStyles = theme => ({

  mainLeft: {
    height: '100vh',
    margin: theme.spacing(2),
    marginBottom: 250,
  },

  mainRight: {
    height: '100vh',
  },
  // [global] Customized scroll bar 
  '@global': {
    '*::-webkit-scrollbar': {
      width: '12px'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },

  table: {
    minWidth: 300,
    height: 800,
    backgroundColor: '#e8eaf6',

  },

  tableHeader: {
    backgroundColor: '#3f51b5',
  },

  tableHeaderFont: {
    color: 'white',
    cursor: 'pointer',
  },

  searchArea: {
    margin: theme.spacing(1),
  },

  videoFrame: {
    width: '100%',
    height: 400,
    marginTop: 40,
    marginBottom: 20,
  },

  myMap: {
    width: '100%',
    height: 410,
  },

});

//Search function query
function searchingFor(searchTerm) {
  return function (x) {
    if (
      x.type.toLowerCase().includes(searchTerm.toLowerCase())
      || x.date_time.toLowerCase().includes(searchTerm.toLowerCase())
      || x.pci.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
      return true;
    }
    return false;
  }
}

// firebase url
const databaseURL = "https://road-defect.firebaseio.com";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defectData: [],
      selectedData: null,
      dialog: false,
      editDialog: false,
      action: false,
      isVideoClicked: false,
      isActive: '',
      searchTerm: '',
      accelerometer: [],
      device_serial_number: '',
      selectedDefectData: [],
      date_time: '',
      type: '',
      latitude: '',
      longitude: '',
      url: '',
      heading: '',
      image: '',
      pci:'',
      editId: '',
      loading: true,
      driverSort: true,
      plateSort: true,
      typeSort: true,
      addressSort: true,
      dateTimeSort: true,
      pciSort: true,
      tempList: [],
      sequentialPlayList: [],
      count: 0,
      isPlayImage: false,
      endPointCount:0,
    }
  }

  //RESTful API GET (READ)
  _get() {
    this.setState({
      defectData: [],
      loading: true,
    })

    fetch(`${databaseURL}/roadDefect.json`).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(defectData => {
      var keys = Object.keys(defectData);
      let defectDataArray = [];
      for (var i = 0; i < keys.length; i++) {
        let key = keys[i];
        Object.assign(defectData[key], { id: key });
        defectDataArray.push(defectData[key]);
      }
      console.log(defectDataArray);
      this.setState({ defectData: defectDataArray, loading: false });
    });
  }

  //RESTful API POST (CREATE)
  // _post(addedItem) {
  //   return fetch(`${databaseURL}/roadDefect.json`, {
  //     method: 'POST',
  //     body: JSON.stringify(addedItem)
  //   }).then(res => {
  //     if (res.status !== 200) {
  //       throw new Error(res.statusText);
  //     }
  //     return res.json();
  //   }).then(data => {
  //     let nextState = this.state.defectData;
  //     Object.assign(addedItem, { id: data.name });
  //     nextState.push(addedItem);
  //     this.setState({ defectData: nextState });
  //   });
  // }

  //RESTful API PUT (UPDATE)
  _put(id, editedItem) {
    return fetch(`${databaseURL}/roadDefect/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify(editedItem)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      this.setState({ selectedData: editedItem })
      this._get();
    });
  }

  //RESTful API DELETE (DELETE)
  _delete(index, id) {
    return fetch(`${databaseURL}/roadDefect/${id}.json`, {
      method: 'DELETE'
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      // let nextState = this.state.defectData;
      // delete nextState[index];
      // this.setState({ defectData: nextState });
      this._get();
    })
  }

  //render
  componentDidMount() {
    //will update data array with data from firebase
    this._get();

    this.myInterval = setInterval(() => {
      if (this.state.count < this.state.sequentialPlayList.length) {
        this.setState(prevState => ({ count: prevState.count + 1 }));
      } else {
        this.setState(() => ({ count: 0 }));
      }
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  //play video event handler
  playItem(index) {
    let tempList = this.state.defectData.slice(index, this.state.defectData.length);

    const playTarget = this.state.defectData[index];
    this.setState({ selectedData: playTarget, isVideoClicked: true, sequentialPlayList: tempList, isActive: index });
  }

  sequentialPlayImage() {

    this.setState(() => ({ count: 0 }));

    this.myInterval = setInterval(() => {
      if (this.state.count < this.state.sequentialPlayList.length) {
        this.setState({
          editId: this.state.sequentialPlayList[this.state.count].id,
          date_time: this.state.sequentialPlayList[this.state.count].date_time,
          type: this.state.sequentialPlayList[this.state.count].type,
          url: this.state.sequentialPlayList[this.state.count].url,
          accelerometer: this.state.sequentialPlayList[this.state.count].accelerometer,
          device_serial_number: this.state.sequentialPlayList[this.state.count].device_serial_number,
          heading: this.state.sequentialPlayList[this.state.count].heading,
          image: this.state.sequentialPlayList[this.state.count].image,
          latitude: this.state.sequentialPlayList[this.state.count].latitude,
          longitude: this.state.sequentialPlayList[this.state.count].longitude,
          url: this.state.sequentialPlayList[this.state.count].url,
          pci: this.state.sequentialPlayList[this.state.count].pci,
          selectedData: this.state.sequentialPlayList[this.state.count],
          isVideoClicked: true,
          isActive: this.state.isActive + 1,
          endPointCount:this.state.count,
        });
      } else {
        clearInterval(this.myInterval);
        this.setState({ selectedData: null, isVideoClicked: false, isActive: null, editDialog:false });
      }
    }, 2000);
  }

  stopSequentialPlay() {
    clearInterval(this.myInterval);
    let tempList = this.state.sequentialPlayList.slice(this.state.endPointCount, this.state.sequentialPlayList.length);
    this.setState(() => ({ count: 0, sequentialPlayList: tempList, }));
  }

  handleEditDialogToggle = () => this.setState({
    editDialog: !this.state.editDialog,
    date_time: '',
    type: '',
    pci:'',
    editId: '',
  })

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleSubmit = () => {
    let modeItem = {
      accelerometer: this.state.accelerometer,
      type: this.state.type,
      date_time: this.state.date_time,
      device_serial_number: this.state.device_serial_number,
      heading: this.state.heading,
      image: this.state.image,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      url: this.state.url,
      pci: this.state.pci,
    }

    //REST API POST request
    this._put(this.state.editId, modeItem);
  }

  editItem(index) {
    this.handleEditDialogToggle();
    let tempList = this.state.defectData.slice(index, this.state.defectData.length);
    const editTarget = this.state.defectData[index];
    this.setState({
      editDialog: true,
      editId: editTarget.id,
      date_time: editTarget.date_time,
      type: editTarget.type,
      url: editTarget.url,
      accelerometer: editTarget.accelerometer,
      device_serial_number: editTarget.device_serial_number,
      heading: editTarget.heading,
      image: editTarget.image,
      latitude: editTarget.latitude,
      longitude: editTarget.longitude,
      url: editTarget.url,
      pci: editTarget.pci,
      selectedData: editTarget,
      isVideoClicked: true, //
      sequentialPlayList: tempList,
      isActive: index,
    });

  }

  //delete event handler
  deleteItem = (index) => {
    const deleteTarget = this.state.defectData[index];
    this._delete(index, deleteTarget.id);
    this.setState({
      isVideoClicked: false,
      selectedData: null,
    })
  }

  handleChange(value) {
    this.setState({ type: value });
  }

  handlePCIChange(value) {
    this.setState({ pci: value });
  }

  handleSearchChange(e) {
    this.setState({
      searchTerm: e.target.value,
    });
  }

  // sort by date_time
  toggletypeSorting() {
    if (this.state.typeSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.type.toLowerCase();
          let y = b.type.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        typeSort: !this.state.typeSort,
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.type.toLowerCase();
          let y = b.type.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        typeSort: !this.state.typeSort,
      });
    }
  }

  // sort by timeText
  toggletimeTextSorting() {
    if (this.state.dateTimeSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.date_time.toLowerCase();
          let y = b.date_time.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        dateTimeSort: !this.state.dateTimeSort
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.date_time.toLowerCase();
          let y = b.date_time.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        dateTimeSort: !this.state.dateTimeSort
      });
    }
  }

  // sort by pci
  togglepciSorting() {
    if (this.state.pciSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.pci.toLowerCase();
          let y = b.pci.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        pciSort: !this.state.pciSort
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.pci.toLowerCase();
          let y = b.pci.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        pciSort: !this.state.pciSort
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <div id="wrap">
          <Header />
          <div className={classes.main}>
            {/* Main Container Grid */}
            <Grid
              container
              direction="row"
            >
              {/* Left Layout with Table Grid */}
              <Grid item xs={12} sm={12} md={6} lg={7}>
                <Box className={classes.mainLeft}>
                  {/* Search & Add Area */}
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <div className={classes.searchArea}>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                          <SearchIcon />
                        </Grid>
                        <Grid item>
                          <TextField
                            id="input-with-icon-grid"
                            label="Search"
                            type="text"
                            name="search"
                            value={this.state.searchTerm}
                            onChange={this.handleSearchChange.bind(this)}
                          />
                        </Grid>
                      </Grid>
                    </div>
                    {/* <div className={classes.searchArea}>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Button
                            style={{ marginRight: '5px' }}
                            variant="contained"
                            color="primary"
                            onClick={this.sequentialPlayImage.bind(this)}
                          >
                            Start
                          </Button>
                        </Grid>
                      </Grid>
                    </div> */}
                  </Grid>
                  {/*End Search & Add Area */}
                  {/* Data Table */}
                  {
                    this.state.loading ? <CircularProgress color="secondary" /> : (
                      <TableContainer component={Paper} className={classes.table}>
                        <Table aria-label="caption table">
                          <TableHead>
                            <TableRow className={classes.tableHeader}>
                              <TableCell className={classes.tableHeaderFont} align="center">Action</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletypeSorting.bind(this)}>Type</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.togglepciSorting.bind(this)}>PCI</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletimeTextSorting.bind(this)}>Time</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              this.state.defectData.filter(searchingFor(this.state.searchTerm)).map((item, index) => {
                                return <DataItem
                                  key={item.id}
                                  type={item.type}
                                  date_time={item.date_time}
                                  url={item.url}
                                  pci={item.pci}
                                  edit={this.editItem.bind(this, index)}
                                  delete={this.deleteItem.bind(this, index)}
                                  play={this.playItem.bind(this, index)}
                                  isActive={this.state.isActive}
                                  index={index}
                                />
                              })
                            }
                          </TableBody>
                          {/* Edit dialog box */}
                          <Dialog
                            fullWidth
                            open={this.state.editDialog}
                            onClose={this.state.handleEditDialogToggle}>
                            <DialogTitle>
                              Edit Information
                              <Button
                                style={{ marginLeft: '15px' }}
                                variant="contained"
                                color="primary"
                                onClick={this.sequentialPlayImage.bind(this)}
                              >Start</Button>
                              <Button
                                style={{ marginLeft: '15px' }}
                                variant="contained"
                                color="secondary"
                                onClick={this.stopSequentialPlay.bind(this)}
                              >Stop</Button>
                            </DialogTitle>
                            <DialogContent>
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                              >Defect Type</InputLabel>
                              <Select
                                fullWidth
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="type"
                                value={this.state.type}
                                onChange={event => this.handleChange(event.target.value)}
                              ><br />
                                <MenuItem value="(P)Pothole paved surface">(P)Pothole paved surface</MenuItem>
                                <MenuItem value="(PN)Pothole non-paved">(PN)Pothole non-paved</MenuItem>
                                <MenuItem value="(PS)Pothole shoulder">(PS)Pothole shoulder</MenuItem>
                                <MenuItem value="(SD)Shoulder Drop-off">(SD)Shoulder Drop-off</MenuItem>
                                <MenuItem value="(C)Crack">(C)Crack</MenuItem>
                                <MenuItem value="(D)Debris">(D)Debris</MenuItem>
                                <MenuItem value="(B)Bridge Deck Spall">(B)Bridge Deck Spall</MenuItem>
                                <MenuItem value="(RD)Road Discontinuity">(RD)Road Discontinuity</MenuItem>
                                <MenuItem value="default">Default</MenuItem>
                              </Select><br /><br />
                              <InputLabel
                                id="demo-simple-select-outlined-label"
                              >PCI</InputLabel>
                              <Select
                                fullWidth
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="pci"
                                value={this.state.pci}
                                onChange={event => this.handlePCIChange(event.target.value)}
                              ><br />
                                <MenuItem value="good">Good</MenuItem>
                                <MenuItem value="fair">Fair</MenuItem>
                                <MenuItem value="poor">Poor</MenuItem>
                              </Select><br /><br />

                              <TextField
                                fullWidth
                                label="Time"
                                type="text"
                                name="timeText"
                                value={this.state.date_time}
                                InputProps={{
                                  readOnly: true,
                                }}
                                onChange={this.handleValueChange} /><br />
                              <br />
                              {
                                (this.state.isVideoClicked) ? (
                                  <video
                                    key={this.state.selectedData.url}
                                    className={classes.videoFrame}
                                    controls
                                    autoPlay
                                    poster={this.state.selectedData.url}
                                  >
                                    <source src={this.state.selectedData.url.includes("@") ? "" : this.state.selectedData.url} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                  </video>
                                ) : (
                                    <video controls className={classes.videoFrame}>
                                      <source src={null} type="video/mp4" />
                                      Your browser does not support HTML5 video.
                                    </video>
                                  )
                              }
                            </DialogContent>
                            <DialogContent>
                              <Button fullWidth className={classes.buttonArea} variant="contained" color="primary" onClick={this.handleSubmit}>Edit</Button>
                              <Button fullWidth className={classes.buttonArea} variant="outlined" color="primary" onClick={this.handleEditDialogToggle}>Close</Button>
                            </DialogContent>
                          </Dialog>
                        </Table>
                      </TableContainer>
                    )
                  }

                  {/*End Data Table */}
                </Box>
              </Grid>
              {/* End Left Layout with Table Grid */}

              {/* Right Layout with video player & information Grid */}
              <Grid item xs={12} sm={12} md={6} lg={5}>
                <Box className={classes.mainRight}>

                  {
                    (this.state.isVideoClicked) ? (
                      <video
                        key={this.state.selectedData.url}
                        className={classes.videoFrame}
                        controls
                        autoPlay
                        poster={this.state.selectedData.url}
                      >
                        <source src={this.state.selectedData.url.includes("@") ? "" : this.state.selectedData.url} type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>
                    ) : (
                        <video controls className={classes.videoFrame}>
                          <source src={null} type="video/mp4" />
                          Your browser does not support HTML5 video.
                        </video>
                      )
                  }

                  <MyMap
                    mapData={this.state.defectData}
                    selectedDataFromTable={this.state.selectedData}
                  />

                </Box>
              </Grid>
              {/* End Right Layout with video player & information Grid */}
            </Grid>
          </div>
          {/* <Footer /> */}
          {/* <div class="footer">Footer</div> */}
        </div>
      </>
    );
  }
}

export default withStyles(useStyles)(Home)
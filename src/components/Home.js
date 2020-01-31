
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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DataItem from './DataItem';
import AddDialog from './AddDialog';
import EditDialog from './EditDialog';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';

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
    if (x.driver.toLowerCase().includes(searchTerm.toLowerCase())
      || x.plate.toLowerCase().includes(searchTerm.toLowerCase())
      || x.type.toLowerCase().includes(searchTerm.toLowerCase())
      // || x.address.toLowerCase().includes(searchTerm.toLowerCase())
      || x.timeText.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true
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
      address: '',
      driver: '',
      plate: '',
      timeText: '',
      type: '',
      latitude: '',
      longitude: '',
      url: '',
      heading: '',
      userID: '',
      timeStamp: '',
      description: '',
      editId: '',
      loading: true,
      driverSort: true,
      plateSort: true,
      typeSort: true,
      addressSort: true,
      timeTextSort: true,
      tempList: [],
      sequentialPlayList: [],
      count: 0,
      isPlayImage: false,
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

      this.setState({ defectData: defectDataArray, loading: false });
    });
  }

  //RESTful API POST (CREATE)
  _post(addedItem) {
    return fetch(`${databaseURL}/roadDefect.json`, {
      method: 'POST',
      body: JSON.stringify(addedItem)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(data => {
      let nextState = this.state.defectData;
      Object.assign(addedItem, { id: data.name });
      nextState.push(addedItem);
      this.setState({ defectData: nextState });
    });
  }

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
        this.setState({ selectedData: this.state.sequentialPlayList[this.state.count], isVideoClicked: true, isActive: this.state.isActive + 1 });
      } else {
        clearInterval(this.myInterval);
        this.setState({ selectedData: null, isVideoClicked: false, isActive: null });
      }
    }, 2000);
  }

  stopSequentialPlay() {
    clearInterval(this.myInterval);
    this.setState(() => ({ count: 0, selectedData: null, isVideoClicked: false, isActive: null }));
  }

  handleDialogToggle = () => this.setState({
    dialog: !this.state.dialog,
    address: '',
    driver: '',
    plate: '',
    timeText: '',
    type: '',
    latitude: '',
    longitude: '',
    editId: '',
    url: '',
    description: '',
    heading: '',
    timeStamp: '',
    userID: '',
  })

  handleEditDialogToggle = () => this.setState({
    editDialog: !this.state.editDialog,
    address: '',
    driver: '',
    plate: '',
    timeText: '',
    type: '',
    latitude: '',
    longitude: '',
    editId: '',
    url: '',
    description: '',
    heading: '',
    timeStamp: '',
    userID: '',
  })

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleSubmit = (mode) => {
    let today = new Date();
    let date = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let timeStamp = today.getTime();

    let modeItem = {
      address: this.state.address,
      driver: this.state.driver,
      plate: this.state.plate,
      timeText: this.state.timeText + " " + date,
      timeStamp: this.state.timeStamp,
      heading: this.state.heading,
      userID: this.state.userID,
      type: this.state.type,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      url: this.state.url,
      description: this.state.description
    }

    if (mode === 'add') {
      //REST API POST request
      modeItem.timeStamp = timeStamp;

      this._post(modeItem);
      this.handleDialogToggle();
    } else if (mode === 'edit') {
      //REST API POST request
      modeItem.timeText = this.state.timeText;

      this._put(this.state.editId, modeItem);
      this.handleEditDialogToggle();
    }
  }

  editItem(index) {
    this.handleEditDialogToggle();
    const editTarget = this.state.defectData[index];
    this.setState({
      editId: editTarget.id,
      address: editTarget.address,
      driver: editTarget.driver,
      plate: editTarget.plate,
      timeText: editTarget.timeText,
      type: editTarget.type,
      timeStamp: editTarget.timeStamp,
      heading: editTarget.heading,
      userID: editTarget.userID,
      latitude: editTarget.latitude,
      longitude: editTarget.longitude,
      url: editTarget.url,
      description: editTarget.description,
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

  handleSearchChange(e) {
    this.setState({
      searchTerm: e.target.value,
    });
  }

  // // sort by video url
  // toggleActionSoring() {
  //   if (this.state.action) {
  //     const filteredData = this.state.defectData.filter(data => data.url.length > 0);
  //     this.setState({ defectData: filteredData });
  //   }
  // }

  // sort by driver name
  toggleDriverSorting() {
    if (this.state.driverSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.driver.toLowerCase();
          let y = b.driver.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        driverSort: !this.state.driverSort,
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.driver.toLowerCase();
          let y = b.driver.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        driverSort: !this.state.driverSort,
      });
    }
  }

  // sort by plate
  togglePlateSorting() {
    if (this.state.plateSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.plate.toLowerCase();
          let y = b.plate.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        plateSort: !this.state.plateSort,
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.plate.toLowerCase();
          let y = b.plate.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        plateSort: !this.state.plateSort,
      });
    }
  }

  // sort by type
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

  // sort by address
  toggleAddressSorting() {
    // if (this.state.addressSort) {
    //   this.setState({
    //     defectData: this.state.defectData.sort(function (a, b) {
    //       let x = a.address.toLowerCase();
    //       let y = b.address.toLowerCase();
    //       if (x < y) { return -1; }
    //       if (x > y) { return 1; }
    //       return 0;
    //     }),
    //     addressSort: !this.state.addressSort,
    //   });

    // } else {
    //   this.setState({
    //     defectData: this.state.defectData.sort(function (a, b) {
    //       let x = a.address.toLowerCase();
    //       let y = b.address.toLowerCase();
    //       if (x > y) { return -1; }
    //       if (x < y) { return 1; }
    //       return 0;
    //     }),
    //     addressSort: !this.state.addressSort,
    //   });
    // }
  }

  // sort by timeText
  toggletimeTextSorting() {
    if (this.state.timeTextSort) {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.timeText.toLowerCase();
          let y = b.timeText.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        timeTextSort: !this.state.timeTextSort
      });

    } else {
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.timeText.toLowerCase();
          let y = b.timeText.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        timeTextSort: !this.state.timeTextSort
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
                    <div className={classes.searchArea}>
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

                          <Button
                            style={{ marginRight: '5px' }}
                            variant="contained"
                            color="secondary"
                            onClick={this.stopSequentialPlay.bind(this)}
                          >
                            Stop
                          </Button>
                          <Fab
                            color="primary"
                            aria-label="add"
                            size='small'
                            onClick={this.handleDialogToggle}
                          >
                            <AddIcon />
                          </Fab>
                          <AddDialog
                            dialog={this.state.dialog}
                            handleDialogToggle={this.handleDialogToggle}
                            address={this.state.address}
                            driver={this.state.driver}
                            plate={this.state.plate}
                            timeText={this.state.timeText}
                            type={this.state.type}
                            description={this.state.description}
                            handleValueChange={this.handleValueChange}
                            handleChange={this.handleChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this, 'add')}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  {/*End Search & Add Area */}
                  {/* Data Table */}
                  {
                    this.state.loading ? <CircularProgress color="secondary" /> : (
                      <TableContainer component={Paper} className={classes.table}>
                        <Table aria-label="caption table">
                          <TableHead>
                            <TableRow className={classes.tableHeader}>
                              <TableCell className={classes.tableHeaderFont} align="center" >Action</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggleDriverSorting.bind(this)}>Driver</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.togglePlateSorting.bind(this)}>Plate #</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletypeSorting.bind(this)}>Type</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggleAddressSorting.bind(this)}>Address</TableCell>
                              <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletimeTextSorting.bind(this)}>Time</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              this.state.defectData.filter(searchingFor(this.state.searchTerm)).map((item, index) => {
                                return <DataItem
                                  key={item.id}
                                  driver={item.driver}
                                  plate={item.plate}
                                  type={item.type}
                                  address={item.address}
                                  timeText={item.timeText}
                                  url={item.url}
                                  edit={this.editItem.bind(this, index)}
                                  delete={this.deleteItem.bind(this, index)}
                                  play={this.playItem.bind(this, index)}
                                  isActive={this.state.isActive}
                                  index={index}
                                />
                              })
                            }
                          </TableBody>

                          <EditDialog
                            editDialog={this.state.editDialog}
                            handleEditDialogToggle={this.handleEditDialogToggle}
                            handleValueChange={this.handleValueChange}
                            handleChange={this.handleChange.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this, 'edit')}
                            address={this.state.address}
                            driver={this.state.driver}
                            plate={this.state.plate}
                            timeText={this.state.timeText}
                            type={this.state.type}
                            latitude={this.state.latitude}
                            longitude={this.state.longitude}
                            description={this.state.description}
                          />
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
                  {/* {(this.state.isVideoClicked) ? <MediaPlayer selectedData={this.state.selectedData} /> : <BlankMediaPlayer />} */}
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
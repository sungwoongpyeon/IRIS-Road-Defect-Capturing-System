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
import { FormControl, FormLabel, FormControlLabel, FormGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox'
// import EditDialog from './EditDialog';
import { CircularProgress } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
    height: 300,
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
    height: 500,
    marginTop: 40,
    marginBottom: 20,
  },

  myMap: {
    width: '100%',
    height: 300,
  },

});

//Search function query
function searchingFor(searchTerm) {
  return function (x) {
    if (
      x.type.toLowerCase().includes(searchTerm.toLowerCase())
      || x.date_time.toLowerCase().includes(searchTerm.toLowerCase())
      || x.pci.toLowerCase().includes(searchTerm.toLowerCase())
      || x.city_name.toLowerCase().includes(searchTerm.toLowerCase())
      || x.device_serial_number.toLowerCase().includes(searchTerm.toLowerCase())
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
      entireDefectData: [],
      searchDataMaxIndex: 0,
      selectedData: null,
      isVideoClicked: false,
      isActive: '',
      searchTerm: '',
      hasDefect: '0',
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
      pci: '',
      city_name: '',
      session_id: '',
      editId: '',
      loading: true,
      typeSort: true,
      citySort: true,
      dateTimeSort: false,
      pciSort: true,
      tempList: [],
      sequentialPlayList: [],
      count: 0,   //index
      isPlayImage: false,
      endPointCount: 0,
      isPlaying: false,
      preState: null,
      potholeP: false,
      potholeNP: false,
      potholeS: false,
      shoulderDO: false,
      crack: false,
      debris: false,
      bridge: false,
      discontinuity: false,
      default: false,
      good: false,
      fair: false,
      poor: false,
      numberOfDays: '1',
    }
  }

  //RESTful API GET (READ)
  //temporary change: the first photo is shown at the beginning
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

      this.setState({ defectData: defectDataArray, loading: false },
        () => {
          this.toggletimeTextSorting();
          this.setState({ entireDefectData: this.state.defectData }, () => {
            //sort by time desc
            this.filterByDay();
          })
        });
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
      // this.setState({ defectData: nextState}, ()=>{
      //   this.setState({selectedData:this.state.defectData[0]});
      // });
      this.setState({ dateTimeSort: false }, () => this._get());
    })
  }

  //render
  componentDidMount() {
    //will update data array with data from firebase
    this._get();
  }

  //play video event handler
  playItem(index) {
    const playTarget = this.state.defectData[index];
    this.setState({ selectedData: playTarget, isVideoClicked: true, isActive: index });
  }

  //get format YYYY-mm-dd
  convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
  }

  selectFirstRow() {
    this.setState({ count: 0 }, () => {
      if (this.state.defectData.length > 0) {
        let index = this.state.count;
        this.setState({
          editId: this.state.defectData[index].id,
          date_time: this.state.defectData[index].date_time,
          type: this.state.defectData[index].type,
          url: this.state.defectData[index].url,
          accelerometer: this.state.defectData[index].accelerometer,
          device_serial_number: this.state.defectData[index].device_serial_number,
          heading: this.state.defectData[index].heading,
          image: this.state.defectData[index].image,
          latitude: this.state.defectData[index].latitude,
          longitude: this.state.defectData[index].longitude,
          pci: this.state.defectData[index].pci,
          city_name: this.state.defectData[index].city_name,
          session_id: this.state.defectData[index].session_id,
          selectedData: this.state.defectData[index],
          isVideoClicked: true,
          isActive: index,
        });
      }
    })
  }

  //filter data based off the select dropdown list
  filterByDay() {
    var filterData = [];
    var today = this.convertDate(new Date()); //get format YYYY-mm-dd
    switch (this.state.numberOfDays) {
      case '1':
        this.state.entireDefectData.forEach((data) => {
          let tempDate = this.convertDate(new Date(data.date_time));  //get format YYYY-mm-dd
          if (this.state.hasDefect === '0') {
            if (tempDate === today && data.type === 'Default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (tempDate === today && data.type !== 'Default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      case '2':
        let yesterday = this.convertDate(new Date(new Date().setDate(new Date().getDate() - 1)));
        this.state.entireDefectData.forEach((data) => {
          let tempDate = this.convertDate(new Date(data.date_time));  //get format YYYY-mm-dd
          if (this.state.hasDefect === '0') {
            if (tempDate === yesterday && data.type === 'Default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (tempDate === yesterday && data.type !== 'Default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      case '3':
        let twoDaysAgo = this.convertDate(new Date(new Date().setDate(new Date().getDate() - 2)));
        this.state.entireDefectData.forEach((data) => {
          let tempDate = this.convertDate(new Date(data.date_time));  //get format YYYY-mm-dd
          if (this.state.hasDefect === '0') {
            if (tempDate === twoDaysAgo && data.type.toLowerCase() === 'default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (tempDate === twoDaysAgo && data.type.toLowerCase() !== 'default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      case '4':
        let threeDaysAgo = this.convertDate(new Date(new Date().setDate(new Date().getDate() - 3)));
        this.state.entireDefectData.forEach((data) => {
          let tempDate = this.convertDate(new Date(data.date_time));  //get format YYYY-mm-dd
          if (this.state.hasDefect === '0') {
            if (tempDate === threeDaysAgo && data.type.toLowerCase() === 'default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (tempDate === threeDaysAgo && data.type.toLowerCase() !== 'default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      case '5':
        let fourDaysAgo = this.convertDate(new Date(new Date().setDate(new Date().getDate() - 4)));
        this.state.entireDefectData.forEach((data) => {
          let tempDate = this.convertDate(new Date(data.date_time));  //get format YYYY-mm-dd
          if (this.state.hasDefect === '0') {
            if (tempDate === fourDaysAgo && data.type.toLowerCase() === 'default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (tempDate === fourDaysAgo && data.type.toLowerCase() !== 'default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      case '6':
        this.state.entireDefectData.forEach((data) => {
          if (this.state.hasDefect === '0') {
            if (data.type.toLowerCase() === 'default') {
              filterData.push(data);
            }
          } else if (this.state.hasDefect === '1') {
            if (data.type.toLowerCase() !== 'default') {
              filterData.push(data);
            }
          }
        })
        this.selectFirstRow();
        return this.setState({ defectData: filterData });
      default:
        return null;
    }
  }


  //on changed hanlde function for type checkboxes
  handleCheckboxChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.checked, type: event.target.value },
      () => {
        console.log(this.state.type)
      })
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  //delete event handler
  deleteItem = (index) => {
    const deleteTarget = this.state.defectData[index];
    this._delete(index, deleteTarget.id);
    this.setState({
      selectedData: this.state.defectData[0],
    })
  }

  handleChange(value) {
    this.setState({ numberOfDays: value }, () => this.filterByDay());
  }

  handleHasDefectChange(value) {
    this.setState({ hasDefect: value }, () => this.filterByDay());
  }

  //change to function to work with check boxes
  handlePCIChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.checked, pci: event.target.value }, () => console.log(this.state.pci));
  }

  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value, count: 0 }, () => {
      this.selectFirstRow();
    });
  }

  // sort by date_time
  toggletypeSorting() {
    if (this.state.typeSort) {
      //asc
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
      //desc
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

  // sort by date_time
  toggleCitySorting() {
    if (this.state.citySort) {
      //asc
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.city_name.toLowerCase();
          let y = b.city_name.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }),
        citySort: !this.state.citySort,
      });
    } else {
      //desc
      this.setState({
        defectData: this.state.defectData.sort(function (a, b) {
          let x = a.city_name.toLowerCase();
          let y = b.city_name.toLowerCase();
          if (x > y) { return -1; }
          if (x < y) { return 1; }
          return 0;
        }),
        citySort: !this.state.citySort,
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
        dateTimeSort: !this.state.dateTimeSort,
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
        dateTimeSort: !this.state.dateTimeSort,
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
        pciSort: !this.state.pciSort,
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
        pciSort: !this.state.pciSort,
      });
    }
  }

  //go to pervous photo
  goBack = () => {

    if (this.state.count < this.state.defectData.length && this.state.count > 0) {
      let index = this.state.count - 1;
      this.setState({
        editId: this.state.defectData[index].id,
        date_time: this.state.defectData[index].date_time,
        type: this.state.defectData[index].type,
        url: this.state.defectData[index].url,
        accelerometer: this.state.defectData[index].accelerometer,
        device_serial_number: this.state.defectData[index].device_serial_number,
        heading: this.state.defectData[index].heading,
        image: this.state.defectData[index].image,
        latitude: this.state.defectData[index].latitude,
        longitude: this.state.defectData[index].longitude,
        pci: this.state.defectData[index].pci,
        city_name: this.state.defectData[index].city_name,
        session_id: this.state.defectData[index].session_id,
        selectedData: this.state.defectData[index],
        isVideoClicked: true,
        isActive: index,
        endPointCount: index,
        count: index
      });
    }
  }

  //go to the next photo
  goNext = () => {
    if (this.state.count < this.state.defectData.length - 1 && this.state.count >= 0) {
      let index = this.state.count + 1;
      this.setState({
        editId: this.state.defectData[index].id,
        date_time: this.state.defectData[index].date_time,
        type: this.state.defectData[index].type,
        url: this.state.defectData[index].url,
        accelerometer: this.state.defectData[index].accelerometer,
        device_serial_number: this.state.defectData[index].device_serial_number,
        heading: this.state.defectData[index].heading,
        image: this.state.defectData[index].image,
        latitude: this.state.defectData[index].latitude,
        longitude: this.state.defectData[index].longitude,
        pci: this.state.defectData[index].pci,
        city_name: this.state.defectData[index].city_name,
        session_id: this.state.defectData[index].session_id,
        selectedData: this.state.defectData[index],
        isVideoClicked: true,
        isActive: index,
        endPointCount: index,
        count: index,
      });

      if (this.state.good !== false || this.state.fair !== false || this.state.poor !== false) {
        this.handleSubmit();
      }
    }
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
      city_name: this.state.city_name,
      session_id: this.state.session_id,
    }

    //REST API POST request
    this._put(this.state.editId, modeItem);
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
              {/* Right Layout with video player & information Grid */}
              <Grid item xs={12} sm={12} md={12} lg={7}>
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
                        <source src={this.state.selectedData.url} type="video/mp4" />
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

              {/* Left Layout with Table Grid */}
              <Grid item xs={12} sm={12} md={12} lg={5}>
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
                        <Grid item>
                          <Select
                            fullWidth
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            name="type"
                            value={this.state.numberOfDays}
                            onChange={event => this.handleChange(event.target.value)}
                          >
                            <MenuItem value="1">Today</MenuItem>
                            <MenuItem value="2">Yesterday</MenuItem>
                            <MenuItem value="3">2 days ago</MenuItem>
                            <MenuItem value="4">3 days ago</MenuItem>
                            <MenuItem value="5">4 days ago</MenuItem>
                            <MenuItem value="6">All days</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item>
                          <Select
                            fullWidth
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            name="hasDefect"
                            value={this.state.hasDefect}
                            onChange={event => this.handleHasDefectChange(event.target.value)}
                          >
                            <MenuItem value="0">Default</MenuItem>
                            <MenuItem value="1">Has Defect</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  {/*End Search & Add Area */}
                  {/* Data Table */}
                  <Grid item xs={12} xm={6}>
                    {
                      this.state.loading ? <CircularProgress color="secondary" /> : (
                        <TableContainer component={Paper} className={classes.table}>
                          <Table aria-label="caption table">
                            <TableHead>
                              <TableRow className={classes.tableHeader}>
                                <TableCell className={classes.tableHeaderFont} align="center">Action</TableCell>
                                <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletypeSorting.bind(this)}>Type</TableCell>
                                <TableCell className={classes.tableHeaderFont} align="center" onClick={this.togglepciSorting.bind(this)}>PCI</TableCell>
                                <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggleCitySorting.bind(this)}>City</TableCell>
                                <TableCell className={classes.tableHeaderFont} align="center" onClick={this.toggletimeTextSorting.bind(this)}>Time</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* edit={this.editItem.bind(this, index)} */}
                              {
                                this.state.defectData.filter(searchingFor(this.state.searchTerm)).map((item, index) => {
                                  
                                  return <DataItem
                                  key={item.id}
                                  type={item.type}
                                  date_time={item.date_time}
                                  url={item.url}
                                  pci={item.pci}
                                  city_name={item.city_name}
                                  delete={this.deleteItem.bind(this, index)}
                                  play={this.playItem.bind(this, index)}
                                  isActive={this.state.isActive}
                                  index={index}
                                />
                                })
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )
                    }
                  </Grid>
                  <Grid item xs={12} xm={12}>
                    <Button
                      style={{ marginLeft: '15px' }}
                      variant="contained"
                      color="primary"
                      onClick={this.goBack}
                    >Prevous</Button>
                    <Button
                      style={{ marginLeft: '15px' }}
                      variant="contained"
                      color="secondary"
                      onClick={this.goNext}
                    >Next</Button>
                  </Grid>
                  <Grid item xs={12} xm={12}>
                    Edit Information

                    <Grid>
                      <FormControl component="fieldset" className="classes.formControl">
                        <FormGroup>
                          <Grid container direction="row">
                            <Grid item xs={6} xm={6}>
                              <FormLabel
                                id="demo-simple-select-outlined-label"
                              >Defect Type</FormLabel>
                              <FormControlLabel
                                control={<Checkbox checked={this.state.potholeP} onChange={this.handleCheckboxChange("potholeP")} value="(P)Pothole paved surface" />}
                                label="(P)Pothole paved surface"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.potholeNP} onChange={this.handleCheckboxChange("potholeNP")} value="(PN)Pothole non-paved" />}
                                label="(PN)Pothole non-paved"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.potholeS} onChange={this.handleCheckboxChange("potholeS")} value="(PS)Pothole shoulder" />}
                                label="(PS)Pothole shoulder"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.shoulderDO} onChange={this.handleCheckboxChange("shoulderDO")} value="(SD)Shoulder Drop-off" />}
                                label="(SD)Shoulder Drop-off"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.crack} onChange={this.handleCheckboxChange("crack")} value="(C)Crack" />}
                                label="(C)Crack"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.debris} onChange={this.handleCheckboxChange("debris")} value="(D)Debris" />}
                                label="(D)Debris"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.bridge} onChange={this.handleCheckboxChange("bridge")} value="(B)Bridge Deck Spall" />}
                                label="(B)Bridge Deck Spall"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.discontinuity} onChange={this.handleCheckboxChange("discontinuity")} value="(RD)Road Discontinuity" />}
                                label="(RD)Road Discontinuity"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.default} onChange={this.handleCheckboxChange("default")} value="default" />}
                                label="default"
                              />
                            </Grid>
                            <Grid item xs={6} xm={6}>
                              <FormLabel
                                id="demo-simple-select-outlined-label"
                              >PCI</FormLabel>
                              <FormControlLabel
                                control={<Checkbox checked={this.state.good} onChange={this.handlePCIChange('good')} value="Good" />}
                                label="Good"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.fair} onChange={this.handlePCIChange('fair')} value="Fair" />}
                                label="Fair"
                              />
                              <FormControlLabel
                                control={<Checkbox checked={this.state.poor} onChange={this.handlePCIChange('poor')} value="Poor" />}
                                label="Poor"
                              />
                            </Grid>

                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/*End Data Table */}
                </Box>
              </Grid>
              {/* End Left Layout with Table Grid */}


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
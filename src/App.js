/*

  Author: Shubham Singla
  Created on 23 August 2019

*/

import React, { Component } from 'react';
import XLSX from 'xlsx';
import DisplayTable from './components/DisplayTable.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile() {

    if (this.state.file.name === undefined){
      return;
    }

    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {header:1});
      /* Update state */
      this.setState({
          data: data
      });
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  render() {
    return (
      <div className="container">
        <div className="buttonDiv">
          <input type="file" className="form-control Button" id="file" accept={'.xlsx, .csv, .xls'} onChange={this.handleChange} />
          <br/>
          <input type='submit' className="Button"
            value="Show"
            onClick={this.handleFile} />
        </div>
        <DisplayTable dataArray={this.state.data} />
      </div>
    )
  }
}

export default App;

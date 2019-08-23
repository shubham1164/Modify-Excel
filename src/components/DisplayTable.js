import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const NAME_CHARS_LIMIT = 50;

class DisplayTable extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataArray: []
    }
  }

  static getDerivedStateFromProps(props, state){
    if (state.dataArray.length === 0){
      return({
        dataArray: props.dataArray
      })
    } else {
      // Return null if the state hasn't changed
      return null;
    }
  }

  handleTableDataClick = (id, index, oldVal) => {
    try{
      // column name = id, name, email, contact, date
      // column index = 0, 1, 2, 3, 4
      // no change needed for column 'id' (or columnIndex=0)
      if (index === '0'){
        return;
      }

      var newValue = prompt("Update value from '"+oldVal+"' to ");
      if (newValue == null){
        return;
      }

      // Validations
      switch(index){
        case '1': {
          // Name must be 30 chars long
          if (newValue.trim().length > NAME_CHARS_LIMIT){
            throw new Error('Name length must be less than '+NAME_CHARS_LIMIT)
          }
          break;
        }
        case '2': {
          // email
          // eslint-disable-next-line
          var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(newValue) === false){
            throw new Error('Invalid Email Address')
          }
          break;
        }
        case '3': {
          // contact must be numbers and 10 digit long
          var number = parseInt(newValue);
          if (isNaN(number) || number.toString().length !== 10){
            throw new Error('Invalid Number')
          }
          break;
        }
        case '4': {
          // Date (DD/MM/YYYY)
          if(!this.validateDate(newValue)){
            throw new Error('Invalid Date')
          }
          break;
        }
        default: {}
      }

      // Update the latest value in the UI
      this.updateTheNewValue(id, index, newValue)

    } catch(e){
      alert(e.message)
    }
  }

  updateTheNewValue = (id, valueIndex, newValue) => {
    const length = this.state.dataArray.length;
    var index = -1;
    for (var i=0; i<length; i++){
      if (this.state.dataArray[i][0] === id){
        index = i;
        break;
      }
    }
    if(index !== -1){
      let dataArray = [...this.state.dataArray];
      let data = [...dataArray[index]];
      data[valueIndex] = newValue;
      dataArray[index] = data;
      this.setState({
        dataArray: dataArray
      });
    }
  }

  validateDate = (dateValue) => {
    var isValid = true;

    try{
      // eslint-disable-next-line
      var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

      // Match the date format through regular expression
      if (dateValue.match(dateformat)) {
          // Extract the string into month, date and year
          var pdate = dateValue.split('/');
          var mm = parseInt(pdate[0]);
          var dd = parseInt(pdate[1]);
          var yy = parseInt(pdate[2]);
          // Create list of days of a month [assume there is no leap year by default]
          var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          if (mm === 1 || mm > 2) {
              if (dd > ListofDays[mm - 1]) {
                throw new Error('Invalid')
              }
          }
          if (mm === 2) {
              var lyear = false;
              if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                  lyear = true;
              }
              if ((lyear === false) && (dd >= 29)) {
                throw new Error('Invalid')
              }
              if ((lyear === true) && (dd > 29)) {
                throw new Error('Invalid')
              }
          }
      } else {
          throw new Error('Invalid')
      }
    } catch(e){
      isValid = false;
    }
    return isValid;
  }

  renderHeader = () => {
    var arr = this.state.dataArray[0];
    return (
      <tr>
      {
        arr.map(val => {
          return (
            <th key={val}>{val}</th>
          )
        })
      }
      </tr>
    )
  }

  renderData = (obj, index) => {
    return (
      <tr key={index}>
      {
        Object.keys(obj).map((key, index) => {
          return (
            <td onClick={() => this.handleTableDataClick(obj[0], key, obj[key])} key={obj[key]+index}>{obj[key]}</td>
          )
        })
      }
      </tr>
    )
  }

  render() {
    var dataArray = this.state.dataArray;
    return (
      <div>
      {/* 1st row is headers and 2nd row contains data */}
      {dataArray.length>2 && (
        <table className="customers">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {dataArray.map((obj, index) => {
              // ignore the headers here
              if (index === 0){ return null}
              return this.renderData(obj, index)
            })}
            </tbody>
          </table>
      )}
      </div>
    )
  }
}

DisplayTable.propTypes = {
  dataArray: PropTypes.array.isRequired
};

DisplayTable.defaultProps = {
  dataArray: []
};

export default DisplayTable;

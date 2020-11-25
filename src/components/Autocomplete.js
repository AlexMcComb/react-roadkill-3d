import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from './store';
import "./Autocomplete.css";

class Autocomplete extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false
  };

  onChange = (e) => {
    const { options } = this.props;
    const userInput = e.currentTarget.value;
    const filteredOptions = options.filter(
      (optionName) =>
        optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.props.onUserInputChange({ userInput: e.currentTarget.value});

    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
    });
  };

  onClick = (e) => {
    this.props.onUserInputChange({ userInput: e.currentTarget.innerText});
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false
    });
  };
  
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;
    if (e.keyCode === 13) {
    e.preventDefault();
    this.props.onUserInputChange({ userInput: filteredOptions[activeOption]});
      this.setState({
        activeOption: 0,
        showOptions: false
      });
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      this.setState({ activeOption: activeOption + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { activeOption, filteredOptions, showOptions }
    } = this;
    let optionList;
    if (showOptions && this.props.userInput.userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((optionName, index) => {
              let className;
              if (index === activeOption) {
                className = 'option-active';
              }
              return (
                <li className={className} key={optionName} onClick={onClick}>
                  {optionName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <em>No Option!</em>
          </div>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="search">
          <input
            type="text"
            className="search-box"
            placeholder="Number (Optional)"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={this.props.userInput.userInput}
          />
        </div>
        {optionList}
      </React.Fragment>
    );
  }
}


function mapStateToProps(state) {
  return {
      userInput: state.userInput
  }
};

function mapDispatchToProps(dispatch) {
  return {
      onUserInputChange(userInput) {
          dispatch(actions.userInputChanged(userInput));
      }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);
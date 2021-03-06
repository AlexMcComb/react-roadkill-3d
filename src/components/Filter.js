import React from "react";
import { DateRangePicker } from "react-dates";
import { connect } from "react-redux";
import { actions } from "./store";
import "./App.css";
import moment from "moment";
import { MapStylePicker } from "./controls";
import Autocomplete from "./Autocomplete";
import roadkillData from "../roadkill";
import { ROUTES } from "../routes";
import { SPECIES } from "../species";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// TODO: UPDATE IN THE FUTURE TO USE ELASTICSEARCH TO MAKE FILTERING CLEANER/EASIER
const Filter = ({
  userInput,
  from,
  to,
  startDate,
  endDate,
  onProcessData,
  onProcessAllRoadkill,
  onFilterToggle,
  filterDisplay,
  onDatesChange,
  onSpeciesChange,
  onFromChange,
  onToChange,
  onSpeciesChangePoints,
  currentSpecies,
  onStyleChange,
  focusedInput,
  onFocusedInputChanged,
  focused,
}) => {
  const datesChange = (startDate, endDate) => {
    onDatesChange(startDate, endDate);
  };

  const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <select
          value={month.month()}
          onChange={(e) => onMonthSelect(month, e.target.value)}
          className={"select-menu"}
        >
          {moment.months().map((label, value) => (
            <option value={value} key={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          className={"select-menu"}
          value={month.year()}
          onChange={(e) => onYearSelect(month, e.target.value)}
        >
          <option value={2016} key={2016}>
            2016
          </option>
          <option value={2017} key={2017}>
            2017
          </option>
          <option value={2018} key={2018}>
            2018
          </option>
        </select>
      </div>
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    speciesChange();
  };

  const handleChange = (event) => {
    event.preventDefault();
    onSpeciesChange({ species: event.target.value });
  };

  const handleFromChange = (event) => {
    event.preventDefault();
    onFromChange(event.target.value);
  };

  const handleToChange = (event) => {
    event.preventDefault();
    onToChange(event.target.value);
  };

  const loadAllRoadKill = () => {
    const points = roadkillData.reduce((accu, curr) => {
      //convert string date to date
      const mydate = new Date(curr.date);
      accu.push({
        route: [Number(curr.route)],
        MP: [Number(curr.MP)],
        species: [String(curr.species)],
        position: [Number(curr.longitude), Number(curr.latitude)],
        //format date as ISO to match moment date format in the Airbnb calendar
        date: [mydate.toISOString()],
        datenumber: [Number(curr.datenumber)],
      });
      return accu;
    }, []);
    onProcessAllRoadkill(points);
    const result = points.filter((item) => {
      const { date, route, MP } = item;
      return userInput.userInput && from === "" && to === ""
        ? date >= startDate.format() &&
            date <= endDate.format() &&
            route[0] == userInput.userInput
        : userInput.userInput && from !== "" && to !== ""
        ? date >= startDate.format() &&
          date <= endDate.format() &&
          route[0] == userInput.userInput &&
          MP[0] >= from &&
          MP[0] <= to
        : date >= startDate.format() && date <= endDate.format();
    });
    if (
      !Array.isArray(result) ||
      !result.length ||
      startDate == null ||
      endDate == null ||
      (to === "" && from !== "") ||
      (to !== "" && from === "")
    ) {
      alert("No results for your selection");
      loadPoints();
    } else {
      onProcessAllRoadkill(result);
    }
  };

  const speciesChange = () => {
    if (startDate == null || endDate == null) {
      alert("Invalid dates.  Please use the format MM/DD/YYYY");
      loadPoints();
    } else {
      const points = roadkillData.reduce((accu, curr) => {
        //convert string date to date
        const mydate = new Date(curr.date);
        accu.push({
          route: [Number(curr.route)],
          MP: [Number(curr.MP)],
          species: [String(curr.species)],
          position: [Number(curr.longitude), Number(curr.latitude)],
          //format date as ISO to match moment date format in the Airbnb calendar
          date: [mydate.toISOString()],
          datenumber: [Number(curr.datenumber)],
        });
        return accu;
      }, []);
      onSpeciesChangePoints(points);
      if (currentSpecies.species == "All Roadkill") {
        loadAllRoadKill();
      } else {
        const result = points.filter((item) => {
          const { date, route, MP, species } = item;
          return userInput.userInput && from === "" && to === ""
            ? species == currentSpecies.species &&
                date >= startDate.format() &&
                date <= endDate.format() &&
                route[0] == userInput.userInput
            : userInput.userInput &&
              userInput.userInput !== null &&
              from !== "" &&
              to !== ""
            ? species == currentSpecies.species &&
              date >= startDate.format() &&
              date <= endDate.format() &&
              route[0] == userInput.userInput &&
              MP[0] >= from &&
              MP[0] <= to
            : species == currentSpecies.species &&
              date >= startDate.format() &&
              date <= endDate.format();
        });
        if (
          !Array.isArray(result) ||
          !result.length ||
          startDate == null ||
          endDate == null ||
          (to === "" && from !== "") ||
          (to !== "" && from === "")
        ) {
          alert("No results for your selection");
          loadPoints();
        } else {
          onSpeciesChangePoints(result);
        }
      }
    }
  };

  const loadPoints = () => {
    const points = roadkillData.reduce((accu, curr) => {
      //convert string date to date
      const mydate = new Date(curr.date);
      accu.push({
        route: [Number(curr.route)],
        MP: [Number(curr.MP)],
        species: [String(curr.species)],
        position: [Number(curr.longitude), Number(curr.latitude)],
        //format date as ISO to match moment date format in the Airbnb calendar
        date: [mydate.toISOString()],
        datenumber: [Number(curr.datenumber)],
      });
      return accu;
    }, []);
    onProcessData(points);
  };

  return (
    <div className="filter">
      <img
        src="https://i.ibb.co/hYgZRbQ/filter.png"
        onClick={onFilterToggle}
        className={"filterButton"}
        alt="Filter"
        title="Filter"
      />
      <form
        className="filterForm"
        style={{ display: filterDisplay }}
        onSubmit={handleSubmit}
      >
        <label className="label">
          Map Style
          <MapStylePicker onStyleChange={onStyleChange} />
        </label>
        <label className="label">
          Date Range
          {/* move function out of render because it causes re render */}
          {
            <DateRangePicker
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) =>
                datesChange(startDate, endDate)
              }
              focusedInput={focusedInput}
              onFocusChange={(focusedInput) =>
                onFocusedInputChanged(focusedInput)
              }
              isOutsideRange={() => false}
              minimumNights={0}
              openDirection={"down"}
              numberOfMonths={1}
              focused={focused}
              renderMonthElement={renderMonthElement}
            />
          }
        </label>
        <label className="label">
          Species
          <select
            className="species-picker select-menu"
            value={currentSpecies.species}
            //gets the value from the drop down
            onChange={handleChange}
          >
            {SPECIES.map((species) => (
              <option key={species.value} value={species.value}>
                {species.label}
              </option>
            ))}
          </select>
        </label>
        <label className="label">Route</label>
        <Autocomplete options={ROUTES} />
        <label className="label">Milepost</label>
        <div className="input-field">
          <input
            type="text"
            onChange={handleFromChange}
            className="search-box"
            id="from"
            placeholder="From"
            disabled={
              userInput.userInput && userInput.userInput !== null
                ? ""
                : "disabled"
            }
          />
        </div>
        <input
          type="text"
          onChange={handleToChange}
          className="search-box"
          placeholder="To"
          disabled={
            userInput.userInput && userInput.userInput !== null
              ? ""
              : "disabled"
          }
        />
        <input type="submit" className="submit" value="Submit" />
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    startDate: state.startDate,
    endDate: state.endDate,
    filterDisplay: state.filterDisplay,
    layerDisplay: state.layerDisplay,
    currentSpecies: state.currentSpecies,
    focusedInput: state.focusedInput,
    regionsCheckbox: state.regionsCheckbox,
    regions: state.regions,
    landownershipCheckbox: state.landownershipCheckbox,
    focused: state.focused,
    milepostView: state.milepostView,
    view: state.view,
    aadtCheckbox: state.aadtCheckbox,
    aadt: state.aadt,
    points: state.points,
    userInput: state.userInput,
    from: state.from,
    to: state.to,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDatesChange(startDate, endDate) {
      dispatch(actions.dateHasChanged(startDate, endDate));
    },
    onFilterToggle() {
      dispatch(actions.filterToggle());
    },
    onLayersToggle() {
      dispatch(actions.layersToggle());
    },
    onSpeciesChange(species) {
      dispatch(actions.speciesHasChanged(species));
    },
    onProcessAllRoadkill(points) {
      dispatch(actions.processAllData(points));
    },
    onSpeciesChangePoints(points) {
      dispatch(actions.speciesHasChangedPoints(points));
    },
    onProcessData(points) {
      dispatch(actions.processData(points));
    },
    onFocusedInputChanged(focusedInput) {
      dispatch(actions.focusChanged(focusedInput));
    },
    onFromChange(from) {
      dispatch(actions.fromChange(from));
    },
    onToChange(to) {
      dispatch(actions.toChange(to));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

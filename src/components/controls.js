import React, { Component } from 'react';
import "./App.css";
import {rgb} from 'd3-color';

export const HEXAGON_CONTROLS = {
  showHexagon: {
    displayName: 'Show Hexagon',
    type: 'boolean',
    value: true
  },
  radius: {
    displayName: 'Radius',
    type: 'range',
    value: 20,
    step: 5,
    min: 0,
    max: 100
  },
  upperPercentile: {
    displayName: 'Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  },
  showScatterplot: {
    displayName: 'Show Scatterplot',
    type: 'boolean',
    value: false
  },
  radiusScale: {
    displayName: 'Radius',
    type: 'range',
    value: 5,
    step: 5,
    min: 1,
    max: 200
  }
};

const MAPBOX_DEFAULT_MAPSTYLES = [
  { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v9' },
  { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v10' },
  { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v10' },
  { label: 'Light', value: 'mapbox://styles/mapbox/light-v9' },
  { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
  {
    label: 'Satellite Streets',
    value: 'mapbox://styles/mapbox/satellite-streets-v10'
  },
  {
    label: 'Navigation Day V4',
    value: 'mapbox://styles/mapbox/navigation-preview-day-v4'
  },
  {
    label: 'Navigation Night V4',
    value: 'mapbox://styles/mapbox/navigation-preview-night-v4'
  },
  {
    label: 'Navigation Day V5',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'Navigation Night V5',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4'
  }
];


export function MapStylePicker({ onStyleChange }) {
  return (
    <select
      className="map-style-picker select-menu"
      onChange={e => onStyleChange(e.target.value)}
    >
      {MAPBOX_DEFAULT_MAPSTYLES.map(style => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}


export function colorToRGBArray(color) {
  if (Array.isArray(color)) {
    return color.slice(0, 4);
  }
  const c = rgb(color);
  return [c.r, c.g, c.b, 45];
}


export class LayerControls extends Component {
  state = { display: "none" }
  _onValueChange(settingName, newValue) {
    const { settings } = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue
      };

      this.props.onChange(newSettings);
    }
  }

  settingsToggle = () => {
    if (this.state.display == 'none') {
      this.setState({ display: "inline-block" })
    }
    else (this.setState({ display: "none" }))
  }
  render() {
    const { title, settings, propTypes = {} } = this.props;
    const { display } = this.state;
    return (
      <div>
        <img src="https://i.ibb.co/kQbjy2y/controls-1.png" onClick={this.settingsToggle} className={"button"} alt="Controls" title="Controls"/>
        <div className="layer-controls" style={{
          display: display
        }}>
          {title && <h4>{title}</h4>}
          {Object.keys(settings).map(key => (
            <div key={key}>
              <label>{propTypes[key].displayName}</label>
              <div style={{ display: 'inline-block', float: 'right' }}>
                {settings[key]}
              </div>
              <Setting
                settingName={key}
                value={settings[key]}
                propType={propTypes[key]}
                onChange={this._onValueChange.bind(this)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const Setting = props => {
  const { propType } = props;
  if (propType && propType.type) {
    switch (propType.type) {
      case 'range':
        return <Slider {...props} />;

      case 'boolean':
        return <Checkbox {...props} />;
      default:
        return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={e => onChange(settingName, e.target.checked)}
        />
      </div>
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;
  return (
    <div key={settingName}>
      <div className="input-group">
        <div>
          <input
            type="range"
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={e => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
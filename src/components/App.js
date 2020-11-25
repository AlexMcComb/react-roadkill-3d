import React, { Component } from "react";
import { LayerControls, HEXAGON_CONTROLS, colorToRGBArray } from "./controls";
import { tooltipStyle } from "../style";
import {
  DeckGL,
  ScatterplotLayer,
  HexagonLayer,
  GeoJsonLayer,
  IconLayer,
  TextLayer,
} from "deck.gl";
import MapGL, { FullscreenControl } from "react-map-gl";
import { connect } from "react-redux";
import { actions } from "./store";
import Filter from "./Filter";
import Layers from "./Layers";
import Points from "./Points";
import "./App.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 62, height: 100, mask: true },
};

const fullscreenControlStyle = {
  position: "absolute",
  top: 11,
  right: 70,
  padding: "10px",
  zIndex: 100000,
};

const HEATMAP_COLORS = [
  [255, 204, 0],
  [255, 136, 0],
  [255, 85, 0],
  [255, 51, 0],
  [255, 30, 0],
  [255, 0, 0],
];

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, 74.2, -40.9, 8000],
  ambientRatio: 0.6,
  diffuseRatio: 0.0,
  specularRatio: 0.0,
  lightsStrength: [0.8, 0.8, 0.8, 0.8],
  numberOfLights: 2,
};

const elevationRange = [0, 1000];

class App extends Component {
  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      longitude: -111.5,
      latitude: 38.5,
      zoom: 6.6,
      pitch: 55,
      bearing: -38.396674584323023,
    },
    style: "mapbox://styles/mapbox/dark-v9",
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null,
    },
    settings: Object.keys(HEXAGON_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: HEXAGON_CONTROLS[key].value,
      }),
      {}
    ),
  };

  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }

  _resize = () => {
    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
    this.milepostVisible();
    this.lowerHeight();
    this.decreaseBinWidth();
  }

  milepostVisible = () => {
    const zoom = this.state.viewport.zoom;
    (this.props.milepostView == true) & (zoom > 10.5)
      ? this.props.onMilesViewChange(true)
      : this.props.onMilesViewChange(false);
  };

  renderLayers = (state) => {
    const { onHover, settings } = state;
    return [
      new GeoJsonLayer({
        id: "land-ownership",
        data: this.props.landownership,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        visible: this.props.landownershipCheckbox,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [0, 0, 0, 0.8],
        getLineColor: (d) => colorToRGBArray(d.properties.color),
        getRadius: 100,
        getLineWidth: 1,
        onHover: (info) =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
          }),
      }),
      settings.showScatterplot &&
        new ScatterplotLayer({
          id: "scatterplot",
          getPosition: (d) => d.position,
          getColor: [255, 140, 0],
          getRadius: 5,
          opacity: 0.5,
          pickable: true,
          radiusMinPixels: 5,
          radiusMaxPixels: 200,
          data: this.props.points,
          onHover,
          ...settings,
        }),
      settings.showHexagon &&
        new HexagonLayer({
          id: "roadkill",
          colorRange: HEATMAP_COLORS,
          elevationRange,
          elevationScale: this.props.elevationHeight,
          coverage: this.props.coverage,
          extruded: true,
          getPosition: (d) => d.position,
          lightSettings: LIGHT_SETTINGS,
          opacity: 0.8,
          pickable: true,
          data: this.props.points,
          onHover,
          ...settings,
        }),
      new GeoJsonLayer({
        id: "regions",
        data: this.props.regions,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        visible: this.props.regionsCheckbox,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 0],
        getRadius: 100,
        getLineWidth: 1,
        onHover: (info) =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
          }),
      }),
      new GeoJsonLayer({
        id: "aadt",
        data: this.props.aadt,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        visible: this.props.aadtCheckbox,
        getLineWidth: 55,
        getLineColor: [102, 51, 153],
        onHover: (info) =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y,
          }),
      }),
      new IconLayer({
        id: "icon-layer",
        data: this.props.mileposts,
        pickable: true,
        visible: this.props.view,
        iconAtlas: "https://i.ibb.co/02j624d/image-6.png",
        iconMapping: ICON_MAPPING,
        getIcon: (d) => "marker",
        getColor: [18, 173, 42],
        sizeScale: 25,
        getPosition: (d) => d.position,
        getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 1000000],
      }),
      new TextLayer({
        id: "text-layer",
        data: this.props.mileposts,
        pickable: true,
        visible: this.props.view,
        getPosition: (d) => d.position,
        getText: (d) => d.MP,
        getSize: 25,
        getAngle: 0,
        getTextAnchor: "end",
        getAlignmentBaseline: "top",
        getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 1000000],
      }),
    ];
  };

  //Hexbin height
  lowerHeight = () => {
    const zoom = this.state.viewport.zoom;
    if (zoom < 7.1) this.props.onLowerHeight(140);
    if (zoom > 7.2) this.props.onLowerHeight(60);
    if (zoom > 9) this.props.onLowerHeight(26);
    if (zoom > 10) this.props.onLowerHeight(8);
    if (zoom > 12) this.props.onLowerHeight(2);
  };

  //Hexbin Width
  decreaseBinWidth = () => {
    const zoom = this.state.viewport.zoom;
    if (zoom < 7.1) this.props.onLowerWidth(50);
    if (zoom > 7.2) this.props.onLowerWidth(30);
    if (zoom > 9) this.props.onLowerWidth(10);
    if (zoom > 10) this.props.onLowerWidth(4);
    if (zoom > 12) this.props.onLowerWidth(1.5);
  };

  //accessing the object within the points array to count length of hexbin
  onHover({ x, y, object }) {
    const label = object
      ? object.points
        ? `${object.points.length} roadkill incidents`
        : "Roadkill Incident"
      : null;
    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  //tooltip hover popup for layers
  _renderTooltip = () => {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            pointerEvents: "none",
            left: pointerX,
            top: pointerY,
          }}
        >
          {hoveredObject.properties.OWNER ? (
            <div>{hoveredObject.properties.OWNER}</div>
          ) : hoveredObject.properties.DWR_REGION ? (
            <div>{hoveredObject.properties.DWR_REGION}</div>
          ) : hoveredObject.properties.AADT2017 ? (
            <div>
              2017 AADT: {hoveredObject.properties.AADT2017}
              <div>2016 AADT: {hoveredObject.properties.AADT2016}</div>
            </div>
          ) : null}
        </div>
      )
    );
  };

  onStyleChange = (style) => {
    this.setState({ style });
  };

  onWebGLInitialize = (gl) => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  };

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const { viewport, settings, hover, style } = this.state;
    const {
      latitude,
      longitude,
      zoom,
      bearing,
      pitch,
      width,
      height,
    } = viewport;
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`,
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
        <Points viewport={this.state.viewport} />
        <Filter onStyleChange={this.onStyleChange} />
        <Layers viewport={this.state.viewport} />
        <LayerControls
          settings={settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={(settings) => this.updateLayerSettings(settings)}
        />
        <MapGL
          {...viewport}
          mapStyle={style}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={(viewport) => this.onViewportChange(viewport)}
          touchRotate={true}
        >
          <div className="fullscreen" style={fullscreenControlStyle}>
            <FullscreenControl />
          </div>
          <DeckGL
            {...settings}
            onWebGLInitialized={this._onWebGLInitialize}
            layers={this.renderLayers({
              onHover: (hover) => this.onHover(hover),
              settings: settings,
            })}
            latitude={latitude}
            longitude={longitude}
            zoom={zoom}
            bearing={bearing}
            pitch={pitch}
            width={width}
            height={height}
          >
            {this._renderTooltip}
          </DeckGL>
        </MapGL>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    points: state.points,
    elevationHeight: state.elevationHeight,
    coverage: state.coverage,
    mileposts: state.mileposts,
    milepostView: state.milepostView,
    landownership: state.landownership,
    landownershipCheckbox: state.landownershipCheckbox,
    regions: state.regions,
    regionsCheckbox: state.regionsCheckbox,
    view: state.view,
    aadt: state.aadt,
    aadtCheckbox: state.aadtCheckbox,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLowerHeight(elevationHeight) {
      dispatch(actions.lowerHeight(elevationHeight));
    },
    onLowerWidth(coverage) {
      dispatch(actions.lowerWidth(coverage));
    },
    onMilesViewChange(truth) {
      dispatch(actions.milesViewChange(truth));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

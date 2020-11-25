import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from './store';

import "./App.css";

const Layers = props => {
    const landownershipChange = () => {
        if (props.landownershipCheckbox == false) {
            props.onLandownershipCheck(true)
            fetch(`https://raw.githubusercontent.com/AlexMcComb/react-roadkill-3d/master/src/landownership.json`)
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res.statusText);
                    }
                    return res.json();
                })
                .then(result => {
                    props.onFetchLandownership(result);
                });
        }
        else {
            props.onLandownershipCheck(false);
            props.onFetchLandownership(null);
        }
    };

    const regionChange = () => {
        if (props.regionsCheckbox == false) {
            props.onRegionsCheck(true)
            fetch(
                `https://raw.githubusercontent.com/AlexMcComb/react-roadkill-3d/master/src/regions.json`
            ).then(res => {
                if (!res.ok) {
                    return Promise.reject(res.statusText);
                }
                return res.json();
            })
                .then(result => {
                    props.onFetchRegions(result);
                });
        }
        else {
            props.onRegionsCheck(false);
            props.onFetchRegions(null);
        }
    };

    const aadtChange = () => {
        if (props.aadtCheckbox == false) {
            props.onAadtCheckbox(true)
            fetch(
                `https://raw.githubusercontent.com/AlexMcComb/react-roadkill-3d/master/src/aadt.json`
            ).then(res => {
                if (!res.ok) {
                    return Promise.reject(res.statusText);
                }
                return res.json();
            })
                .then(result => {
                    props.onFetchAadt(result);
                });
        }
        else {
            props.onAadtCheckbox(false);
            props.onFetchAadt(null);
        }
    };


    const milepostChange = () => {
        if (props.milepostView == false) {
            props.onMilesCheck(true)
            milepostCheck();
        }
        else {
            props.onMilesCheck(false);
            props.onMilesViewChange(false);
        }
    };

    const milepostCheck = () => {
        const zoom = props.viewport.zoom;
        if (zoom > 10.5) {
            props.onMilesViewChange(true);
        }
    };

        return (
            <div className="layers">
                <img src="https://i.ibb.co/DCqnBP8/layers.png" onClick={props.onLayersToggle} className={"layerButton"} alt="Layers" title="Layers" />
                <form className="layerForm" style={{ display: props.layerDisplay }}>
                    <label className="container">
                        <input onClick={regionChange} type="checkbox" name="regions" value="regions" />DWR Regions<br />
                        <span className="checkmark"></span>
                    </label>
                    <label className="container">
                        <input onClick={landownershipChange} type="checkbox" name="landownership" value="landownership" />Land Ownership<br />
                        <span className="checkmark"></span>
                    </label>
                    <label className="container">
                        <input onClick={milepostChange} type="checkbox" name="mileposts" value="mileposts" />Mile Posts<br />
                        <span className="checkmark"></span>
                    </label>
                    <label className="container">
                        <input onClick={aadtChange} type="checkbox" name="aadt" value="aadt" />AADT<br />
                        <span className="checkmark"></span>
                    </label>
                </form>
            </div>
        )
};


function mapStateToProps(state) {
    return {
        layerDisplay: state.layerDisplay,
        regionsCheckbox: state.regionsCheckbox,
        regions: state.regions,
        landownershipCheckbox: state.landownershipCheckbox,
        focused: state.focused,
        milepostView: state.milepostView,
        view: state.view,
        aadtCheckbox: state.aadtCheckbox,
        aadt: state.aadt
    }
};

function mapDispatchToProps(dispatch) {
    return {
        onLayersToggle() {
            dispatch(actions.layersToggle())
        },
        onLandownershipCheck(truth) {
            dispatch(actions.landownershipCheck(truth))
        },
        onFetchLandownership(result) {
            dispatch(actions.fetchLandownershipSuccess(result))
        },
        onRegionsCheck(truth) {
            dispatch(actions.regionsCheck(truth))
        },
        onFetchRegions(result) {
            dispatch(actions.fetchRegionsSuccess(result))
        },
        onMilesCheck(truth) {
            dispatch(actions.milesCheck(truth))
        },
        onMilesViewChange(truth) {
            dispatch(actions.milesViewChange(truth))
        },
        onAadtCheckbox(truth) {
            dispatch(actions.aadtCheck(truth))
        },
        onFetchAadt(result) {
            dispatch(actions.fetchAadt(result))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layers);
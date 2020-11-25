import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { actions } from './store';

import roadkillData from '../roadkill';
import milepostData from '../mileposts';

import "./App.css";

const Points = props => {
    useEffect(() => {
        loadPoints();
        loadMilePosts();
      }, []);
   
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
                datenumber: [Number(curr.datenumber)]
            });
            return accu;
        }, []);
        props.onProcessData(points);
    };

    const loadMilePosts = () => {
        const mileposts = milepostData.reduce((accu, curr) => {
            //convert string date to date
            accu.push({
                route: Number(curr.route),
                MP: String(curr.MP),
                position: [Number(curr.longitude), Number(curr.latitude)],
            });
            return accu;
        }, []);
        props.onProcessMilePosts( mileposts )
    };


    return (null)
}

function mapStateToProps(state) {
    return {
        points: state.points,
        mileposts: state.mileposts,
        milepostView: state.milepostView
    }
};

function mapDispatchToProps(dispatch) {
    return {
        onProcessMilePosts(mileposts) {
            dispatch(actions.loadMilePosts(mileposts));
        },
        onProcessData(points) {
            dispatch(actions.processData(points));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Points);
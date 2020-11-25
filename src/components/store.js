import moment from "moment";

const PROCESS_MILEPOSTS = "PROCESS_MILEPOSTS";
const LAYERS_DISPLAY = "LAYERS_DISPLAY";
const FILTER_DISPLAY = "FILTER_DISPLAY";
const PROCESS_DATA = "PROCESS_DATA";
const SPECIES_CHANGED_POINTS = "SPECIES_CHANGED_POINTS";
const LOWER_HEIGHT = "LOWER_HEIGHT";
const LOWER_WIDTH = "LOWER_WIDTH";
const DATE_CHANGED = "DATE_CHANGED";
const SPECIES_CHANGED = "SPECIES_CHANGED";
const AUTOCOMPLETE_INPUT_CHANGED = "AUTOCOMPLETE_INPUT_CHANGED";
const FOCUSED_INPUT_CHANGED = "FOCUSED_INPUT_CHANGED";
const PROCESS_ALL_DATA = "PROCESS_ALL_DATA";
const ON_LANDOWNERSHIP_CHECK = "ON_LANDOWNERSHIP_CHECK";
const FETCH_LANDOWNERSHIP_SUCCESS = "FETCH_LANDOWNERSHIP_SUCCESS";
const ON_REGIONS_CHECK = "ON_REGIONS_CHECK";
const FETCH_REGIONS_SUCCESS = "FETCH_REGIONS_SUCCESS";
const ON_MILES_CHECK = "ON_MILES_CHECK";
const ON_MILESVIEW = "ON_MILESVIEW";
const ON_AADT_CHECK = "ON_AADT_CHECK";
const FETCH_AADT_SUCCESS = "FECTH_AADT_SUCCESS";
const ON_FROM_CHANGE = "ON_FROM_CHANGE";
const ON_TO_CHANGE = "ON_TO_CHANGE";

const initialState = {
  points: [],
  elevationHeight: 150,
  coverage: 1,
  startDate: moment().subtract(4, 'years'),
  endDate: moment().subtract(4, 'years'),
  filterDisplay: "none",
  layerDisplay: "none",
  currentSpecies: { species: "All Roadkill" },
  focusedInput: "startDate",
  regionsCheckbox: false,
  regions: {},
  landownershipCheckbox: false,
  landownership: {},
  focused: true,
  mileposts: [],
  milepostView: false,
  view: false,
  aadtCheckbox: false,
  aadt: {},
  userInput: false,
  from: "",
  to: ""
};

export const actions = {
  loadMilePosts(mileposts) {
    return {
      type: PROCESS_MILEPOSTS,
      mileposts
    };
  },
  layersToggle() {
    return {
      type: LAYERS_DISPLAY
    };
  },
  filterToggle() {
    return {
      type: FILTER_DISPLAY
    };
  },
  processData(points) {
    return {
      type: PROCESS_DATA,
      points
    };
  },
  speciesHasChangedPoints(result) {
    return {
      type: SPECIES_CHANGED_POINTS,
      result
    };
  },
  lowerHeight(elevationHeight) {
    return {
      type: LOWER_HEIGHT,
      elevationHeight
    };
  },
  lowerWidth(coverage) {
    return {
      type: LOWER_WIDTH,
      coverage
    };
  },
  dateHasChanged(startDate, endDate) {
    return {
      type: DATE_CHANGED,
      startDate,
      endDate
    };
  },
  speciesHasChanged(species) {
    return {
      type: SPECIES_CHANGED,
      species
    };
  },
  userInputChanged(userInput) {
    return {
      type: AUTOCOMPLETE_INPUT_CHANGED,
      userInput
    };
  },
  focusChanged(focusedInput) {
    return {
      type: FOCUSED_INPUT_CHANGED,
      focusedInput
    };
  },
  processAllData(result) {
    return {
      type: PROCESS_ALL_DATA,
      result
    };
  },
  landownershipCheck(truth) {
    return {
      type: ON_LANDOWNERSHIP_CHECK,
      truth
    };
  },
  fetchLandownershipSuccess(result) {
    return {
      type: FETCH_LANDOWNERSHIP_SUCCESS,
      result
    };
  },
  regionsCheck(truth) {
    return {
      type: ON_REGIONS_CHECK,
      truth
    };
  },
  fetchRegionsSuccess(result) {
    return {
      type: FETCH_REGIONS_SUCCESS,
      result
    };
  },
  milesCheck(truth) {
    return {
      type: ON_MILES_CHECK,
      truth
    };
  },
  milesViewChange(truth) {
    return {
      type: ON_MILESVIEW,
      truth
    };
  },
  aadtCheck(truth) {
    return {
      type: ON_AADT_CHECK,
      truth
    };
  },
  fetchAadt(result) {
    return {
      type: FETCH_AADT_SUCCESS,
      result
    };
  },
  fromChange(from) {
    return {
      type: ON_FROM_CHANGE,
      from
    };
  },
  toChange(to) {
    return {
      type: ON_TO_CHANGE,
      to
    };
  }
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case PROCESS_MILEPOSTS: {
      return {
        ...state,
        mileposts: action.mileposts
      };
    }
    case LAYERS_DISPLAY: {
      if (state.layerDisplay == "none") {
        return {
          ...state,
          layerDisplay: "inline-block",
          filterDisplay: "none"
        };
      } else return { ...state, layerDisplay: "none" };
    }
    case FILTER_DISPLAY: {
      if (state.filterDisplay == "none") {
        return {
          ...state,
          filterDisplay: "inline-block",
          layerDisplay: "none"
        };
      } else return { ...state, filterDisplay: "none" };
    }
    case PROCESS_DATA: {
      return {
        ...state,
        points: action.points
      };
    }
    case SPECIES_CHANGED_POINTS: {
      return {
        ...state,
        points: action.result
      };
    }
    case LOWER_HEIGHT: {
      return {
        ...state,
        elevationHeight: action.elevationHeight
      };
    }
    case LOWER_WIDTH: {
      return {
        ...state,
        coverage: action.coverage
      };
    }
    case DATE_CHANGED: {
      return {
        ...state,
        startDate: action.startDate,
        endDate: action.endDate
      };
    }
    case SPECIES_CHANGED: {
      return {
        ...state,
        currentSpecies: action.species
      };
    }
    case AUTOCOMPLETE_INPUT_CHANGED: {
      return {
        ...state,
        userInput: action.userInput
      };
    }
    case FOCUSED_INPUT_CHANGED: {
      return {
        ...state,
        focusedInput: action.focusedInput
      };
    }
    case PROCESS_ALL_DATA: {
      return {
        ...state,
        points: action.result
      };
    }
    case ON_LANDOWNERSHIP_CHECK: {
      return {
        ...state,
        landownershipCheckbox: action.truth
      };
    }
    case FETCH_LANDOWNERSHIP_SUCCESS: {
      return {
        ...state,
        landownership: action.result
      };
    }
    case ON_REGIONS_CHECK: {
      return {
        ...state,
        regionsCheckbox: action.truth
      };
    }
    case FETCH_REGIONS_SUCCESS: {
      return {
        ...state,
        regions: action.result
      };
    }
    case ON_MILES_CHECK: {
      return {
        ...state,
        milepostView: action.truth
      };
    }
    case ON_MILESVIEW: {
      return {
        ...state,
        view: action.truth
      };
    }
    case ON_AADT_CHECK: {
      return {
        ...state,
        aadtCheckbox: action.truth
      };
    }
    case FETCH_AADT_SUCCESS: {
      return {
        ...state,
        aadt: action.result
      };
    }
    case ON_FROM_CHANGE: {
      return {
        ...state,
        from: action.from
      };
    }
    case ON_TO_CHANGE: {
      return {
        ...state,
        to: action.to
      };
    }
    default:
      return state;
  }
}

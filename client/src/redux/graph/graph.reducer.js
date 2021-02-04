import GraphActionTypes from './graph.types';

const INITIAL_STATE = {
  composed: {
    all:[],
    selected:[],
    graphData:[],
    serialNumber:{},
    average:{},
    percision:3,
    type:'Area',
    isSameUnit:true},
  pie: [],
  versus: []
};

const graphReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GraphActionTypes.SET_USER_GRAPH:
      return {
        ...state,
        composed: action.payload.composed,
        pie: action.payload.pie,
        versus: action.payload.versus
      };
    default:
      return state;
  }
};

export default graphReducer;

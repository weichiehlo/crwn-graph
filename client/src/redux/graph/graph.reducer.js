import GraphActionTypes from './graph.type';

const INITIAL_STATE = {
    graph:{},
    isFetching: false,
    errorMessage:undefined
};

const graphReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GraphActionTypes.FETCH_GRAPH_START:
        return {
          ...state,
          isFetching: true
        };
      case GraphActionTypes.FETCH_GRAPH_SUCCESS:
        return {
          ...state,
          isFetching: false,
          graph: {...state.graph,...action.payload}
        };
      case GraphActionTypes.FETCH_GRAPH_FAILURE:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.payload
        };
      default:
        return state;
    }
  };
  
  export default graphReducer;
  
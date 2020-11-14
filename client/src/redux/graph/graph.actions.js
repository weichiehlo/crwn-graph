import GraphActionTypes from './graph.type';

export const fetchGraphStart = (info) => ({
  type: GraphActionTypes.FETCH_GRAPH_START,
  payload: info
});

export const fetchGraphSuccess = data => ({
  type: GraphActionTypes.FETCH_GRAPH_SUCCESS,
  payload: data
});

export const fetchGraphFailure = errorMessage => ({
  type: GraphActionTypes.FETCH_GRAPH_FAILURE,
  payload: errorMessage
});


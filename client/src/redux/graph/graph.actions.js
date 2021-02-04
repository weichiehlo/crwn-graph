import GraphActionTypes from './graph.types';

export const setUserGraph = graph => ({
  type: GraphActionTypes.SET_USER_GRAPH,
  payload: graph
});

import pgActionTypes from './pg.type';

const INITIAL_STATE = {
    pg_data:{},
    isFetching: true,
    errorMessage:undefined
};

const pgReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case pgActionTypes.FETCH_PG_START:
        return {
          ...state,
          isFetching: true
        };
      case pgActionTypes.FETCH_PG_SUCCESS:
        return {
          ...state,
          isFetching: false,
          pg_data: {...state.pg_data,...action.payload}
        };
      case pgActionTypes.FETCH_PG_FAILURE:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.payload
        };
      default:
        return state;
    }
  };
  
  export default pgReducer;
  
import { applyMiddleware, createStore} from 'redux';
import rootReducer from '../reducers/index';
import thunkMiddleware from 'redux-thunk'

export const actionListers = [];

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

function listeners({ getState }) {
  return next => action => {

      let returnValue = next(action)

      if(actionListers){
          actionListers.forEach( listener => {
              if(listener)
                  listener.listenActions(action);

          });
      }

      return returnValue
  }
}

export default function configureStore(initialState) {
  
  const store = createStore(
    rootReducer, 
    initialState,
    applyMiddleware(
      logger,
      thunkMiddleware,
      listeners
    ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = rootReducer;
      store.replaceReducer(nextReducer);
    });
  }

  store.actionListers = actionListers;
  return store;
}

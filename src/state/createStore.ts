import {
  applyMiddleware,
  compose,
  createStore as reduxCreateStore,
  Reducer,
  Store,
  StoreEnhancer,
} from 'redux';

import { DiagrammerAction } from 'diagrammer/state/actions';
import { getRootReducer } from 'diagrammer/state/common/rootReducer';
import { sequenceReducers } from 'diagrammer/state/common/sequenceReducers';
import { layoutReducer } from 'diagrammer/state/layout';
import { ActionInterceptor, createInterceptorMiddleware, getUndoMiddleware } from 'diagrammer/state/middleware';
import { DiagrammerData } from 'diagrammer/state/types';

export default function createStore<NodeType, EdgeType>(
  initialData?: DiagrammerData<NodeType, EdgeType>,
  consumerRootReducer?: Reducer<DiagrammerData<NodeType, EdgeType>, DiagrammerAction<NodeType, EdgeType>>,
  consumerEnhancer?: StoreEnhancer,
  actionInterceptor?: ActionInterceptor<NodeType, EdgeType>,
): Store<DiagrammerData<NodeType, EdgeType>> {
  const interceptorMiddleware = applyMiddleware(createInterceptorMiddleware(actionInterceptor));
  const undoMiddleware = applyMiddleware(getUndoMiddleware());
  const middleware = compose(interceptorMiddleware, undoMiddleware);
  const composedEnhancer = consumerEnhancer
    ? compose(middleware, consumerEnhancer)
    : middleware;

  /**
   * FIXME: Due to this issue: https://github.com/Microsoft/TypeScript/issues/21592
   * The below line needs an "any" typecast. It throws a type error for excessive
   * stack depth otherwise. Also, note that due to the type signatures on the function
   * declaration, type safety is lost within this method, but is retained everywhere else.
   * Remove this when typescript fixes it.
   */

  return reduxCreateStore(
    sequenceReducers<DiagrammerData<NodeType, EdgeType>, DiagrammerAction<NodeType, EdgeType>>(
      getRootReducer(),
      layoutReducer,
      consumerRootReducer,
    ),
    initialData as any,
    composedEnhancer,
  );
}

import filter from 'lodash-es/filter';
import { createUndoMiddleware } from 'redux-undo-redo';

import { CreateEdgeAction, EdgeActions } from 'diagrammer/state/edge/edgeActions';
import { createDeleteItemsAction, createNewItemsAction } from 'diagrammer/state/global/globalActionDispatcher';
import { DeleteItemsAction, GlobalActions } from 'diagrammer/state/global/globalActions';
import { CreateNodeAction, NodeActions } from 'diagrammer/state/node/nodeActions';
import { DiagrammerData, DiagrammerEdge, DiagrammerNode } from 'diagrammer/state/types';

export const getUndoMiddleware = <NodeType, EdgeType>() => createUndoMiddleware<DiagrammerData<NodeType, EdgeType>>({
  revertingActions: {
    [EdgeActions.EDGE_CREATE]: (action: CreateEdgeAction<EdgeType>) => createDeleteItemsAction([], [action.payload.id]),
    [NodeActions.NODE_CREATE]: (action: CreateNodeAction<NodeType>) => createDeleteItemsAction([action.payload.id], []),
    [GlobalActions.DELETE_ITEMS]: {
      action: (action: DeleteItemsAction, args: any) => createNewItemsAction(args.nodes, args.edges),
      createArgs: (state: DiagrammerData<NodeType, EdgeType>, action: DeleteItemsAction) => ({
        edges: filter(state.edges, (edge: DiagrammerEdge<EdgeType>) => action.payload.edgeIds.indexOf(edge.id) > -1),
        nodes: filter(state.nodes, (node: DiagrammerNode<NodeType>) => action.payload.nodeIds.indexOf(node.id) > -1),
      }),
    },
  },
});

import { Store } from 'redux';

import { DiagrammerData, DiagrammerEdge, DiagrammerNode } from 'diagrammer/state/types';

import { CreateItemsAction, DeleteItemsAction, GlobalActionsType } from './globalActions';

export function createDeleteItemsAction(
  nodeIds: string[],
  edgeIds: string[],
): DeleteItemsAction {
  return {
    type: GlobalActionsType.DELETE_ITEMS,
    payload: {
      nodeIds,
      edgeIds,
    },
  };
}

export function createNewItemsAction<NodeType, EdgeType>(
  nodes: DiagrammerNode<NodeType>[],
  edges: DiagrammerEdge<EdgeType>[],
): CreateItemsAction<NodeType, EdgeType> {
  return {
    type: GlobalActionsType.CREATE_ITEMS,
    payload: {
      nodes,
      edges,
    },
  };
}

export function handleDeleteSelectedItems<NodeType, EdgeType>(store: Store<DiagrammerData<NodeType, EdgeType>>) {
  const { edges, nodes } = store.getState();
  const nodeIds: string[] = Object.keys(nodes).filter((id) => nodes[id].diagrammerData.selected);
  const edgeIds: string[] = Object.keys(edges).filter((id) => {
    const edge = edges[id];
    const { src, dest } = edge;

    return edge.diagrammerData.selected
           || nodeIds.indexOf(src) > -1
    || nodeIds.indexOf(dest) > -1;
  });
  const action = createDeleteItemsAction(nodeIds, edgeIds);

  store.dispatch(action);
}

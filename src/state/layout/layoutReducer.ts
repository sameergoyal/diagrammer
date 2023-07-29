import { DiagrammerAction } from 'diagrammer/state/actions';
import getInitialState from 'diagrammer/state/getInitialState';
import { DiagrammerData } from 'diagrammer/state/types';
import { produce } from 'immer';

import hierarchicalLayout from './hierarchicalLayout';
import { LayoutActionsType, LayoutType } from './layoutActions';
import workflowLayout from './workflowLayout';

export function adjustWorkspace<NodeType, EdgeType>(
  state: DiagrammerData<NodeType, EdgeType>,
): DiagrammerData<NodeType, EdgeType> {
  const { nodes } = state;
  const workspaceSize = state.workspace.canvasSize;
  let rightMost = workspaceSize.width;
  let bottomMost = workspaceSize.height;
  let leftMost = 0;
  let topMost = 0;

  const nodeIds = Object.keys(nodes);
  nodeIds.forEach((nodeId) => {
    const node = nodes[nodeId];
    const { position } = node.diagrammerData;
    const { size } = node.diagrammerData;
    rightMost = Math.max(position.x + size.width, rightMost);
    bottomMost = Math.max(position.y + size.height, bottomMost);
    leftMost = Math.min(position.x, leftMost);
    topMost = Math.min(position.y, topMost);
  });

  const width = rightMost - leftMost;
  const height = bottomMost - topMost;

  return produce(state, (draftState) => {
    draftState.workspace.canvasSize.width = width;
    draftState.workspace.canvasSize.height = height;

    // move all nodes if node beyond top left boundary
    if (leftMost < 0 || topMost < 0) {
      nodeIds.forEach((nodeId) => {
        const oldPos = draftState.nodes[nodeId].diagrammerData.position;
        const position = {
          x: oldPos.x - leftMost,
          y: oldPos.y - topMost,
        };
        draftState.nodes[nodeId].diagrammerData.position = position;
      });
    }
  });
}

export default function layoutReducer<NodeType, EdgeType>(
  state: DiagrammerData<NodeType, EdgeType> | undefined,
  action: DiagrammerAction<NodeType, EdgeType>,
): DiagrammerData<NodeType, EdgeType> {
  if (!state) {
    return getInitialState();
  }

  switch (action.type) {
    case LayoutActionsType.LAYOUT:
      switch (action.payload.layoutType) {
        case LayoutType.HIERARCHICAL:
          return adjustWorkspace(hierarchicalLayout(state, action.payload));
        case LayoutType.WORKFLOW:
          return adjustWorkspace(workflowLayout(state, action.payload));
        default:
          return state;
      }
    default:
      return state;
  }
}

import { Draft, produce } from 'immer';

import { DiagrammerAction } from 'diagrammer/state/actions';
import { EdgeActionsType } from 'diagrammer/state/edge';
import { EditorActionsType } from 'diagrammer/state/editor/editorActions';
import { GlobalActionsType } from 'diagrammer/state/global/globalActions';
import {
  DiagrammerNode, DiagrammerNodes, Position, Size,
} from 'diagrammer/state/types';
import { WorkspaceActionsType } from 'diagrammer/state/workspace';

import { NodeActionsType } from './nodeActions';

function isInsideBoundingBox(
  nodePosition: Position,
  nodeSize: Size,
  boundingBoxAnchor: Position,
  boundingBoxPosition: Position,
): boolean {
  const boundingBoxTopLeft: Position = {
    x: Math.min(boundingBoxAnchor.x, boundingBoxPosition.x),
    y: Math.min(boundingBoxAnchor.y, boundingBoxPosition.y),
  };
  const boundingBoxSize: Size = {
    width: Math.abs(boundingBoxAnchor.x - boundingBoxPosition.x),
    height: Math.abs(boundingBoxAnchor.y - boundingBoxPosition.y),
  };
  return (
    nodePosition.x + nodeSize.width >= boundingBoxTopLeft.x
    && nodePosition.x <= boundingBoxTopLeft.x + boundingBoxSize.width
    && nodePosition.y + nodeSize.height >= boundingBoxTopLeft.y
    && nodePosition.y <= boundingBoxTopLeft.y + boundingBoxSize.height
  );
}

export default function nodeReducer<NodeType, EdgeType>(
  state: DiagrammerNodes<NodeType> | undefined,
  action: DiagrammerAction<NodeType, EdgeType>,
): DiagrammerNodes<NodeType> {
  if (state === undefined) {
    return {};
  }
  switch (action.type) {
    case GlobalActionsType.CREATE_ITEMS:
      return produce(state, (draftState) => {
        action.payload.nodes.forEach((node) => {
          draftState[node.id] = node as Draft<DiagrammerNode<NodeType>>;
        });
      });
    case NodeActionsType.NODE_CREATE:
      return produce(state, (draftState) => {
        const {
          id, position, size, typeId, consumerData: untypedConsumerData,
        } = action.payload;
        const consumerData = untypedConsumerData as Draft<NodeType>;
        draftState[id] = {
          id, typeId, consumerData, diagrammerData: { position, size },
        };
      });
    case NodeActionsType.NODE_DELETE:
      return produce(state, (draftState) => {
        delete draftState[action.payload.id];
      });
    case EditorActionsType.FOCUS_NODE:
    case NodeActionsType.NODE_SELECT:
      return produce(state, (draftState) => {
        const nodeIds = Object.keys(draftState);
        nodeIds.forEach((nodeId) => {
          if (nodeId !== action.payload.id) {
            draftState[nodeId].diagrammerData.selected = false;
          } else {
            draftState[nodeId].diagrammerData.selected = true;
          }
        });
      });
    case NodeActionsType.NODE_DRAG_START:
      return produce(state, (draftState) => {
        const currentNode = draftState[action.payload.id];
        if (currentNode) {
          currentNode.diagrammerData.dragging = true;
        }
      });
    case NodeActionsType.NODE_DRAG:
      return produce(state, (draftState) => {
        const currentNode = draftState[action.payload.id];
        if (currentNode) {
          const { position } = action.payload;
          currentNode.diagrammerData.position = position;

          // Shift all the nodes when node is dragged outside top boundary
          if (position.y < 0) {
            const offset = { x: 0, y: -position.y };
            const nodeIds = Object.keys(draftState);
            nodeIds.forEach((nodeId) => {
              const oldPos = draftState[nodeId].diagrammerData.position;
              const newPos = {
                x: oldPos.x + offset.x,
                y: oldPos.y + offset.y,
              };
              draftState[nodeId].diagrammerData.position = newPos;
            });
          }
          // Shift all the nodes when node is dragged outside left boundary
          if (position.x < 0) {
            const offset = { x: -position.x, y: 0 };
            const nodeIds = Object.keys(draftState);
            nodeIds.forEach((nodeId) => {
              const oldPos = draftState[nodeId].diagrammerData.position;
              const newPos = {
                x: oldPos.x + offset.x,
                y: oldPos.y + offset.y,
              };
              draftState[nodeId].diagrammerData.position = newPos;
            });
          }
        }
      });
    case NodeActionsType.NODE_DRAG_END:
      return produce(state, (draftState) => {
        const currentNode = draftState[action.payload.id];
        if (currentNode) {
          currentNode.diagrammerData.dragging = false;
        }
      });
    case EditorActionsType.UPDATE_SELECTION_MARQUEE:
      return produce(state, (draftState) => {
        const nodeIds = Object.keys(draftState);
        nodeIds.forEach((nodeId) => {
          if (isInsideBoundingBox(
            draftState[nodeId].diagrammerData.position,
            draftState[nodeId].diagrammerData.size,
            action.payload.anchor,
            action.payload.position,
          )) {
            draftState[nodeId].diagrammerData.selected = true;
          } else {
            draftState[nodeId].diagrammerData.selected = false;
          }
        });
      });
    case WorkspaceActionsType.WORKSPACE_DESELECT:
    case EdgeActionsType.EDGE_SELECT:
      return produce(state, (draftState) => {
        const nodeIds = Object.keys(draftState);
        nodeIds.forEach((nodeId) => {
          draftState[nodeId].diagrammerData.selected = false;
        });
      });
    case WorkspaceActionsType.WORKSPACE_SELECT_ALL:
      return produce(state, (draftState) => {
        const nodeIds = Object.keys(draftState);
        nodeIds.forEach((nodeId) => {
          draftState[nodeId].diagrammerData.selected = true;
        });
      });
    case GlobalActionsType.DELETE_ITEMS:
      return produce(state, (draftState) => {
        const { nodeIds } = action.payload;
        nodeIds.forEach((nodeId: string) => {
          delete draftState[nodeId];
        });
      });
    default:
      return state;
  }
}

import { Draft, produce } from 'immer';

import { DiagrammerAction } from 'diagrammer/state/actions';
import { GlobalActionsType } from 'diagrammer/state/global/globalActions';
import { NodeActionsType } from 'diagrammer/state/node';
import { DiagrammerEdge, DiagrammerEdges } from 'diagrammer/state/types';
import { WorkspaceActionsType } from 'diagrammer/state/workspace';

import { EdgeActionsType } from './edgeActions';

export default function edgeReducer<NodeType, EdgeType>(
  state: DiagrammerEdges<EdgeType> | undefined,
  action: DiagrammerAction<NodeType, EdgeType>,
): DiagrammerEdges<EdgeType> {
  if (state === undefined) {
    return {};
  }
  switch (action.type) {
    case GlobalActionsType.CREATE_ITEMS:
      return produce(state, (draftState) => {
        action.payload.edges.forEach((edge) => {
          draftState[edge.id] = edge as Draft<DiagrammerEdge<EdgeType>>;
        });
      });
    case EdgeActionsType.EDGE_DELETE:
      return produce(state, (draftState) => {
        delete draftState[action.payload.id];
      });
    case (EdgeActionsType.EDGE_CREATE):
      return produce(state, (draftState) => {
        const {
          id, src, dest, consumerData: untypedConsumerData, connectorSrcType, connectorDestType,
        } = action.payload;
        const consumerData = untypedConsumerData as Draft<EdgeType>;
        const diagrammerData = {};
        draftState[id] = {
          consumerData,
          dest,
          diagrammerData,
          id,
          src,
          connectorSrcType,
          connectorDestType,
        };
      });
    case (EdgeActionsType.EDGE_SELECT):
      return produce(state, (draftState) => {
        const edgeIds = Object.keys(draftState);
        edgeIds.forEach((edgeId) => {
          if (edgeId !== action.payload.id) {
            draftState[edgeId].diagrammerData.selected = false;
          } else {
            draftState[edgeId].diagrammerData.selected = true;
          }
        });
      });
    case (WorkspaceActionsType.WORKSPACE_DESELECT):
    case (NodeActionsType.NODE_SELECT):
      return produce(state, (draftState) => {
        const edgeIds = Object.keys(draftState);
        edgeIds.forEach((edgeId) => {
          draftState[edgeId].diagrammerData.selected = false;
        });
      });
    case (GlobalActionsType.DELETE_ITEMS):
      return produce(state, (draftState) => {
        const { edgeIds } = action.payload;
        edgeIds.forEach((edgeId: string) => {
          delete draftState[edgeId];
        });
      });
    default:
      return state;
  }
}

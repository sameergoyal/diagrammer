import { combineReducers, Reducer } from 'redux';
import { undoHistoryReducer } from 'redux-undo-redo';

import { DiagrammerAction } from 'diagrammer/state/actions';
import { edgeReducer, potentialEdgeReducer } from 'diagrammer/state/edge';
import { editorReducer } from 'diagrammer/state/editor';
import { nodeReducer, potentialNodeReducer } from 'diagrammer/state/node';
import { panelReducer } from 'diagrammer/state/panel';
import { pluginReducer } from 'diagrammer/state/plugin';
import { DiagrammerData } from 'diagrammer/state/types';
import { workspaceReducer } from 'diagrammer/state/workspace';

type RootReducer<NodeType, EdgeType> = Reducer<
DiagrammerData<NodeType, EdgeType>,
DiagrammerAction<NodeType, EdgeType>
>;

export function getRootReducer<NodeType, EdgeType>(): RootReducer<NodeType, EdgeType> {
  return combineReducers<DiagrammerData<NodeType, EdgeType>, DiagrammerAction<NodeType, EdgeType>>({
    edges: edgeReducer,
    editor: editorReducer,
    nodes: nodeReducer,
    panels: panelReducer,
    plugins: pluginReducer,
    potentialEdge: potentialEdgeReducer,
    potentialNode: potentialNodeReducer,
    undoHistory: undoHistoryReducer,
    workspace: workspaceReducer,
  });
}

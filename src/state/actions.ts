import { EdgeAction, EdgeActions } from 'diagrammer/state/edge/edgeActions';
import { EditorAction, EditorActions } from 'diagrammer/state/editor/editorActions';
import { GlobalAction, GlobalActions } from 'diagrammer/state/global/globalActions';
import { LayoutAction, LayoutActions } from 'diagrammer/state/layout/layoutActions';
import { NodeAction, NodeActions } from 'diagrammer/state/node/nodeActions';
import { PanelAction, PanelActions } from 'diagrammer/state/panel/panelActions';
import { WorkspaceAction, WorkspaceActions } from 'diagrammer/state/workspace/workspaceActions';

export const DiagrammerActions = {
  ...NodeActions,
  ...PanelActions,
  ...WorkspaceActions,
  ...EdgeActions,
  ...EditorActions,
  ...GlobalActions,
  ...LayoutActions,
};

export type DiagrammerAction<NodeType, EdgeType> = NodeAction<NodeType> | WorkspaceAction | PanelAction |
EdgeAction<EdgeType> | GlobalAction<NodeType, EdgeType> | EditorAction | LayoutAction;

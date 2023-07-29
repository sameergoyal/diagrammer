import { DiagrammerData, EditorMode } from 'diagrammer/state/types';
import { getDefaultWorkspaceState } from 'diagrammer/state/workspace';

export default function getInitialState<NodeType, EdgeType>(): DiagrammerData<NodeType, EdgeType> {
  return {
    nodes: {},
    edges: {},
    panels: {},
    workspace: getDefaultWorkspaceState(),
    editor: {
      mode: EditorMode.DRAG,
    },
  };
}

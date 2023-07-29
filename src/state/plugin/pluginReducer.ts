import { DiagrammerAction } from 'diagrammer/state/actions';
import { DiagrammerPlugins } from 'diagrammer/state/types';

export default function pluginReducer<NodeType, EdgeType>(
  state: DiagrammerPlugins | undefined,
  _action: DiagrammerAction<NodeType, EdgeType>,
): DiagrammerPlugins {
  if (state === undefined) {
    return {};
  }
  return state;
}

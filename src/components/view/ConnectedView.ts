import { connect } from 'react-redux';

import ConfigService from 'diagrammer/service/ConfigService';
import { DiagrammerData } from 'diagrammer/state/types';

import { View } from './View';

export interface ConnectedViewOwnProps<NodeType, EdgeType> {
  configService: ConfigService<NodeType, EdgeType>;
}

function mapStateToProps<NodeType, EdgeType>(
  state: DiagrammerData<NodeType, EdgeType>,
): { state: DiagrammerData<NodeType, EdgeType> } {
  return { state };
}

export const getConnectedView = () => connect(mapStateToProps)(View);

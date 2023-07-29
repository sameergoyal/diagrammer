import * as Preact from 'preact';

import { ComposeView } from 'diagrammer/components/common';
import {
  Connector, ConnectorProps, ConnectorType,
} from 'diagrammer/components/connector';
import {
  BoundRenderCallback, ConnectorPlacement, ConnectorPlacementType, DestroyCallback,
  TypeForVisibleConnectorTypes, VisibleConnectorTypes,
} from 'diagrammer/service/ConfigService';
import { DiagrammerComponentsType } from 'diagrammer/service/ui/types';
import { DiagrammerNode } from 'diagrammer/state/types';

import './Node.scss';

export interface NodeProps<NodeType> {
  connectorPlacement?: ConnectorPlacementType;
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
  diagrammerNode: DiagrammerNode<NodeType>;
  visibleConnectorTypes?: TypeForVisibleConnectorTypes;
}

export default class Node<NodeType> extends Preact.Component<NodeProps<NodeType>, {}> {
  public render(): JSX.Element {
    const { diagrammerData, id } = this.props.diagrammerNode;
    const { x, y } = diagrammerData.position;
    const { width, height } = diagrammerData.size;
    const transform = `translate3d(${x}px, ${y}px, 0)`;
    const { renderCallback, destroyCallback } = this.props;

    return (
      <div
        className="dm-node"
        style={{ width, height, transform }}
        data-id={id}
        data-type={DiagrammerComponentsType.NODE}
        data-event-target
        data-draggable
      >
        <ComposeView
          renderCallback={renderCallback}
          destroyCallback={destroyCallback}
        />
        {this.renderConnectors()}
      </div>
    );
  }

  public shouldComponentUpdate = (
    nextProps: NodeProps<NodeType>,
  ) => nextProps.diagrammerNode !== this.props.diagrammerNode;

  private getConnectors(): ConnectorProps[] {
    const { id, diagrammerData } = this.props.diagrammerNode;
    const { connectorPlacement } = this.props;
    const { width, height } = diagrammerData.size;
    const horizontalCenter = width / 2;
    const verticalCenter = height / 2;
    const { INPUT, OUTPUT } = ConnectorType;

    switch (connectorPlacement) {
      case ConnectorPlacement.LEFT_RIGHT:
        return [
          { id, position: { x: 0, y: verticalCenter }, type: INPUT },
          { id, position: { x: width, y: verticalCenter }, type: OUTPUT },
        ];
      case ConnectorPlacement.TOP_BOTTOM:
        return [
          { id, position: { x: horizontalCenter, y: 0 }, type: INPUT },
          { id, position: { x: horizontalCenter, y: height }, type: OUTPUT },
        ];
      default:
        return [];
    }
  }

  private getFilteredConnectors(): ConnectorProps[] {
    const connectorProps = this.getConnectors();

    if (!this.props.visibleConnectorTypes) {
      return connectorProps;
    }

    const { INPUT, OUTPUT } = ConnectorType;
    switch (this.props.visibleConnectorTypes) {
      case VisibleConnectorTypes.INPUT_ONLY:
        return connectorProps.filter((connectorProp) => connectorProp.type === INPUT);
      case VisibleConnectorTypes.OUTPUT_ONLY:
        return connectorProps.filter((connectorProp) => connectorProp.type === OUTPUT);
      case VisibleConnectorTypes.NONE:
        return [];
      default:
        return connectorProps;
    }
  }

  private renderConnectors(): JSX.Element[] {
    return this.getFilteredConnectors().map((connector) => {
      const { id, type, position } = connector;
      return <Connector key={`${id}-${type}`} id={id} type={type} position={position} />;
    });
  }
}

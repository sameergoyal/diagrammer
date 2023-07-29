import * as Preact from 'preact';

import { ComposeView } from 'diagrammer/components/common';
import { BoundRenderCallback, DestroyCallback } from 'diagrammer/service/ConfigService';
import { getCenterCoordinateForCurve, getInflectionPoint } from 'diagrammer/service/positionUtils';
import { DiagrammerComponentsType } from 'diagrammer/service/ui/types';
import { Position } from 'diagrammer/state/types';

import './EdgeBadge.scss';

export interface EdgeBadgeProps {
  id: string;
  src: Position;
  dest: Position;
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
  isPartOfEdgePair?: boolean;
}

export default class EdgeBadge extends Preact.Component<EdgeBadgeProps> {
  public render() {
    const {
      id, src, dest, renderCallback, destroyCallback, isPartOfEdgePair,
    } = this.props;

    let left = Math.min(src.x, dest.x);
    let top = Math.min(src.y, dest.y);
    const width = Math.abs(src.x - dest.x);
    const height = Math.abs(src.y - dest.y);

    if (isPartOfEdgePair) {
      const q = getInflectionPoint(src, dest);
      const centerCoordinate = getCenterCoordinateForCurve(src, dest, q);
      left = centerCoordinate.x - (width * 0.5);
      top = centerCoordinate.y - (height * 0.5);
    }
    const style = {
      left, top, width, height,
    };

    return (
      <div
        className="dm-badge"
        style={style}
      >
        <div
          data-id={id}
          data-type={DiagrammerComponentsType.EDGE_BADGE}
          data-event-target
          className="dm-badge-inner"
        >
          <ComposeView
            renderCallback={renderCallback}
            destroyCallback={destroyCallback}
          />
        </div>
      </div>
    );
  }
}

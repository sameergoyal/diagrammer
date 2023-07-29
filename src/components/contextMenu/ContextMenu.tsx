import * as Preact from 'preact';

import { ComposeView } from 'diagrammer/components/common';
import { BoundRenderCallback, DestroyCallback } from 'diagrammer/service/ConfigService';
import { DiagrammerComponentsType } from 'diagrammer/service/ui/types';
import { Position } from 'diagrammer/state/types';

import './ContextMenu.scss';

export interface ContextMenuProps {
  position: Position;
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
}

export default class ContextMenu extends Preact.Component<ContextMenuProps> {
  public render(): JSX.Element {
    const { x, y } = this.props.position;
    const transform = `translate3d(${x}px, ${y}px, 0)`;
    const { renderCallback, destroyCallback } = this.props;

    return (
      <div
        className="dm-context-menu"
        style={{ transform }}
        data-type={DiagrammerComponentsType.CONTEXT_MENU}
      >
        <ComposeView
          renderCallback={renderCallback}
          destroyCallback={destroyCallback}
        />
      </div>
    );
  }
}

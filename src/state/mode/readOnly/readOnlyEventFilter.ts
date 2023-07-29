import { DiagrammerComponentsType } from 'diagrammer/service/ui/types';
import { ContainerEventType, DragEventType, WheelEventType } from 'diagrammer/service/ui/UIEventManager';
import { NormalizedDragEvent, NormalizedEvent } from 'diagrammer/service/ui/UIEventNormalizer';

const { WORKSPACE } = DiagrammerComponentsType;

export default function readOnlyEventFilter(event: NormalizedEvent): boolean {
  const { type } = event;

  switch (type) {
    case ContainerEventType.DIAGRAMMER_CONTAINER_UPDATE:
    case WheelEventType.MOUSE_WHEEL:
      return true;
    case DragEventType.DRAG: {
      const { target } = event as NormalizedDragEvent;
      return target.type === WORKSPACE;
    }
    default: return false;
  }
}

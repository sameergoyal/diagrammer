import { Store } from 'redux';

import ConfigService from 'diagrammer/service/ConfigService';
import Observer from 'diagrammer/service/observer/Observer';
import { subtract } from 'diagrammer/service/positionUtils';
import { DiagrammerComponentsType } from 'diagrammer/service/ui/types';
import {
  ContainerEventType,
  DragEventType,
  DropEventType,
  EventType,
  KeyboardEventType,
  MouseClickEventType,
  MouseMoveEventType,
  WheelEventType,
} from 'diagrammer/service/ui/UIEventManager';
import {
  KeyboardCode,
  KeyboardKey,
  NormalizedContainerEvent,
  NormalizedDragEvent,
  NormalizedDropEvent,
  NormalizedEvent,
  NormalizedKeyboardEvent,
  NormalizedMouseClickEvent,
  NormalizedMouseHoverEvent,
  NormalizedMouseScrollEvent,
} from 'diagrammer/service/ui/UIEventNormalizer';
import UITargetNormalizer from 'diagrammer/service/ui/UITargetNormalizer';
import {
  handleEdgeClick,
  handleEdgeCreate,
  handleEdgeDrag,
  handleEdgeDragEnd,
  handleEdgeDragStart,
  handleEdgeMouseOut,
  handleEdgeMouseOver,
} from 'diagrammer/state/edge/edgeActionDispatcher';
import {
  handleHideContextMenu,
  handleHideSelectionMarquee,
  handleShowContextMenu,
  handleShowSelectionMarquee,
  handleUpdateSelectionMarquee,
} from 'diagrammer/state/editor/editorActionDispatcher';
import { handleDeleteSelectedItems } from 'diagrammer/state/global/globalActionDispatcher';
import { rootEventFilter } from 'diagrammer/state/mode';
import {
  handleNodeClick,
  handleNodeCreate,
  handleNodeDrag,
  handleNodeDragEnd,
  handleNodeDragStart,
  handlePotentialNodeDrag,
  handlePotentialNodeDragEnd,
  handlePotentialNodeDragStart,
} from 'diagrammer/state/node/nodeActionDispatcher';
import {
  handlePanelDrag,
  handlePanelDragStart,
} from 'diagrammer/state/panel/panelActionDispatcher';

import {
  DiagrammerData, DiagrammerWorkspace, EditorMode, Position,
} from 'diagrammer/state/types';
import {
  handleSelectAll,
  handleWorkspaceClick,
  handleWorkspaceDrag,
  handleWorkspaceResize,
  handleWorkspaceZoom,
} from 'diagrammer/state/workspace/workspaceActionDispatcher';

const DATA_ATTR_TYPE = 'data-type';
export default class ActionDispatcher<NodeType, EdgeType> {
  private static getNormalizedPositionOffset = (
    position: Position,
    offset = { x: 0, y: 0 },
  ): Position => subtract(position, offset);

  private static getNormalizedPositionOffsetInWorkspace = (
    position: Position,
    workspace: DiagrammerWorkspace,
    offset = { x: 0, y: 0 },
  ): Position => {
    const targetPosition = ActionDispatcher.getNormalizedPositionOffset(position, offset);
    return {
      x: (targetPosition.x - workspace.position.x) / workspace.scale,
      y: (targetPosition.y - workspace.position.y) / workspace.scale,
    };
  };

  constructor(
    private observer: Observer,
    private store: Store<DiagrammerData<NodeType, EdgeType>>,
    private config: ConfigService<NodeType, EdgeType>,
  ) {
    this.subscribeToUIEvents();
  }

  private subscribeToUIEvents() {
    const {
      LEFT_CLICK, RIGHT_CLICK, MOUSE_DOWN,
    } = MouseClickEventType;
    const { MOUSE_OVER, MOUSE_OUT } = MouseMoveEventType;
    const { DRAG, DRAG_START, DRAG_END } = DragEventType;
    const {
      DROP,
    } = DropEventType;
    const { MOUSE_WHEEL } = WheelEventType;
    const { KEY_DOWN } = KeyboardEventType;
    const { DIAGRAMMER_CONTAINER_UPDATE } = ContainerEventType;

    this.subscribeWithFilter(LEFT_CLICK, this.handleLeftMouseClick);
    this.subscribeWithFilter(RIGHT_CLICK, this.handleRightMouseClick);
    this.subscribeWithFilter(MOUSE_DOWN, this.handleMouseDown);
    this.subscribeWithFilter(MOUSE_OVER, this.handleMouseOver);
    this.subscribeWithFilter(MOUSE_OUT, this.handleMouseOut);
    this.subscribeWithFilter(DRAG, this.handleDrag);
    this.subscribeWithFilter(DRAG_START, this.handleDragStart);
    this.subscribeWithFilter(DRAG_END, this.handleDragEnd);
    this.subscribeWithFilter(DROP, this.handleDrop);
    this.subscribeWithFilter(DIAGRAMMER_CONTAINER_UPDATE, this.handleContainerUpdate);
    this.subscribeWithFilter(MOUSE_WHEEL, this.handleWheelScroll);
    this.subscribeWithFilter(KEY_DOWN, this.handleKeyDown);
  }

  // Typescript will not allow `event` to be typed as `NormalizedEvent`,
  // which is a union type of all possible normalized events.  No idea why.

  private createEventFilterCallback(handler: (event: any) => void): (e: NormalizedEvent) => void {
    return (e: NormalizedEvent) => {
      const { mode } = this.store.getState().editor;

      if (rootEventFilter(e, mode)) {
        handler(e);
      }
    };
  }

  private subscribeWithFilter(event: EventType, handler: (event: any) => void): void {
    const { subscribe } = this.observer;

    subscribe(event, this.createEventFilterCallback(handler));
  }

  private handleLeftMouseClick = (event: NormalizedMouseClickEvent): void => {
    const { target } = event;
    const { type, id } = target;

    switch (type) {
      case DiagrammerComponentsType.NODE:
        handleNodeClick(this.store, id);
        break;
      case (DiagrammerComponentsType.EDGE_BADGE):
      case (DiagrammerComponentsType.EDGE):
        handleEdgeClick(this.store, id);
        break;
      case (DiagrammerComponentsType.WORKSPACE):
        handleWorkspaceClick(this.store);
        break;
      default:
        break;
    }
  };

  private handleMouseOver = (event: NormalizedMouseHoverEvent): void => {
    const { target } = event;
    const { type, id } = target;

    switch (type) {
      case (DiagrammerComponentsType.EDGE_BADGE):
      case (DiagrammerComponentsType.EDGE):
        handleEdgeMouseOver(this.store, id);
        break;
      default:
        break;
    }
  };

  private handleMouseOut = (event: NormalizedMouseHoverEvent): void => {
    const { target } = event;
    const { type, id } = target;

    switch (type) {
      case (DiagrammerComponentsType.EDGE_BADGE):
      case (DiagrammerComponentsType.EDGE):
        handleEdgeMouseOut(this.store, id);
        break;
      default:
        break;
    }
  };

  private handleDrag = (event: NormalizedDragEvent): void => {
    const { target, position, offset = { x: 0, y: 0 } } = event;
    const { type, id } = target;
    const editorMode = this.store.getState().editor.mode;
    const workspaceState = this.store.getState().workspace;

    switch (type) {
      case DiagrammerComponentsType.PANEL_DRAG_HANDLE:
        if (id) {
          const normalizedPosition = ActionDispatcher.getNormalizedPositionOffset(position, offset);
          const draggableElement = target.originalTarget as HTMLElement;
          handlePanelDrag(
            this.store,
            id,
            draggableElement,
            normalizedPosition,
            workspaceState.viewContainerSize,
          );
        }
        break;
      case DiagrammerComponentsType.NODE:
        handleNodeDrag(this.store, id, ActionDispatcher.getNormalizedPositionOffsetInWorkspace(
          position,
          workspaceState,
          offset,
        ));
        break;
      case DiagrammerComponentsType.WORKSPACE:
        switch (editorMode) {
          case EditorMode.SELECT:
            handleUpdateSelectionMarquee(
              this.store,
              ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
            );
            break;
          case EditorMode.DRAG:
          default:
            handleWorkspaceDrag(this.store, ActionDispatcher.getNormalizedPositionOffset(position, offset));
            break;
        }
        break;
      case (DiagrammerComponentsType.NODE_CONNECTOR):
        handleEdgeDrag(
          this.store,
          // No item offset, bc we want to draw dragged edges right at the tip of the pointer
          ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
        );
        break;
      case (DiagrammerComponentsType.POTENTIAL_NODE):
        handlePotentialNodeDrag(
          this.store,
          ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
        );
        break;
      default:
        break;
    }
  };

  private handleDragStart = (event: NormalizedDragEvent): void => {
    const { target, position } = event;
    const { type, id } = target;
    const editorMode = this.store.getState().editor.mode;
    const workspaceState = this.store.getState().workspace;
    switch (type) {
      case DiagrammerComponentsType.WORKSPACE:
        if (editorMode === EditorMode.SELECT) {
          handleShowSelectionMarquee(
            this.store,
            ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
          );
        }
        break;
      case DiagrammerComponentsType.PANEL_DRAG_HANDLE:
        handlePanelDragStart(this.store, id);
        break;
      case DiagrammerComponentsType.NODE:
        handleNodeDragStart(this.store, id);
        break;
      case (DiagrammerComponentsType.NODE_CONNECTOR): {
        const connectorType = target?.originalTarget?.getAttribute('data-connector-type') || undefined;
        if (connectorType) {
          handleEdgeDragStart(
            this.store,
            id,
            // No item offset, bc we want to draw dragged edges right at the tip of the pointer
            ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
            connectorType,
          );
        } else {
          handleEdgeDragStart(
            this.store,
            id,
            // No item offset, bc we want to draw dragged edges right at the tip of the pointer
            ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
          );
        }
        break;
      }
      case (DiagrammerComponentsType.POTENTIAL_NODE):
        handlePotentialNodeDragStart(
          this.store,
          this.config,
          target,
          ActionDispatcher.getNormalizedPositionOffsetInWorkspace(position, workspaceState),
        );
        break;
      default:
        break;
    }
  };

  private handleDragEnd = (event: NormalizedDragEvent): void => {
    const { target } = event;
    const { type, id } = target;
    const editorState = this.store.getState().editor;
    const editorMode = editorState && editorState.mode;

    switch (type) {
      case DiagrammerComponentsType.WORKSPACE:
        if (editorMode === EditorMode.SELECT) {
          handleHideSelectionMarquee(this.store);
        }
        break;
      case DiagrammerComponentsType.NODE:
        handleNodeDragEnd(this.store, id);
        break;
      case (DiagrammerComponentsType.NODE_CONNECTOR):
        handleEdgeDragEnd(this.store, id);
        break;
      case (DiagrammerComponentsType.POTENTIAL_NODE):
        handlePotentialNodeDragEnd(this.store, id);
        break;
      default:
        break;
    }
  };

  private handleWheelScroll = (event: NormalizedMouseScrollEvent): void => {
    const { delta, originalEvent, position } = event;

    const editorState = this.store.getState().editor;

    if (UITargetNormalizer.getTarget(originalEvent, DATA_ATTR_TYPE, DiagrammerComponentsType.WORKSPACE)) {
      originalEvent.preventDefault();

      if (!editorState.contextMenu) {
        handleWorkspaceZoom(this.store, -delta, position);
      }
    }
  };

  private handleDrop = (event: NormalizedDropEvent): void => {
    const {
      target, dropzone,
    } = event;
    const { type, id } = target;

    switch (dropzone.type) {
      case (DiagrammerComponentsType.NODE_CONNECTOR):
        if (type === DiagrammerComponentsType.NODE_CONNECTOR) {
          const srcConnectorType = target?.originalTarget?.getAttribute('data-connector-type') || undefined;
          const destConnectorType = dropzone?.originalTarget?.getAttribute('data-connector-type') || undefined;
          if (srcConnectorType || destConnectorType) {
            handleEdgeCreate(this.store, id, dropzone.id, srcConnectorType, destConnectorType);
          } else {
            handleEdgeCreate(this.store, id, dropzone.id);
          }
        }
        break;
      case (DiagrammerComponentsType.WORKSPACE):
        if (type === DiagrammerComponentsType.POTENTIAL_NODE) {
          handleNodeCreate(this.store, id);
        }
        break;
      default:
        break;
    }

    // Handle drop
  };

  private handleContainerUpdate = (event: NormalizedContainerEvent): void => {
    const { contextRect } = event;

    const size = { height: contextRect.height, width: contextRect.width };

    // Handle container resize
    handleWorkspaceResize(this.store, size);
  };

  private handleRightMouseClick = (event: NormalizedMouseClickEvent): void => {
    handleShowContextMenu(this.store, this.config, event);
  };

  private handleMouseDown = (_event: NormalizedMouseClickEvent): void => {
    handleHideContextMenu(this.store);
  };

  // @NOTE Justification for using KeyDown as opposed to KeyUp or KeyPress for the Delete event:
  // 1) We cannot use KeyPress for the Delete key (or other non-printable keys).
  //    See: https://stackoverflow.com/questions/1116244/capturing-delete-keypress-with-jquery
  // 2) This leaves us with 2 options: KeyUp or KeyDown.  Other similar enterprise applications
  //    tend to use KeyDown instead of KeyUp for this type of event.
  //
  // The issue with using KeyDown is that it continues to fire if held.
  // This isn't an issue with delete, but it may cause an issue if
  // we were doing something like duplicating a node via keypress.

  private handleKeyDown = (event: NormalizedKeyboardEvent): void => {
    const { key, modKey } = event;

    switch (key) {
      case KeyboardKey.A:
        if (modKey) {
          handleSelectAll(this.store);
        }
        break;
      case KeyboardCode.DELETE:
        handleDeleteSelectedItems(this.store);
        break;
      case KeyboardCode.BACKSPACE:
        handleDeleteSelectedItems(this.store);
        break;
      default:
        break;
    }
  };
}

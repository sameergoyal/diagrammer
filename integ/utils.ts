import {
  Diagrammer, EditorMode, Event, Layout, WorkflowLayoutDirection, WorkspaceActions,
} from 'diagrammer/index';
import { DiagrammerNode, DiagrammerPotentialNode, Size } from 'diagrammer/state/types';
import { Action, AnyAction } from 'redux';

export function createDivWithText(text: string) {
  const newDiv = document.createElement('div');
  const newContent = document.createTextNode(text);
  newDiv.appendChild(newContent);
  return newDiv;
}

export function createPotentialNode(node: DiagrammerPotentialNode, container: HTMLElement) {
  const id = node.typeId;
  const newDiv = createDivWithText(id);
  newDiv.classList.add('rectangle', 'example-node');
  container.innerHTML = '';
  container.appendChild(newDiv);
  return newDiv;
}

export function createRectangularNode(node: DiagrammerNode<{ odd?: boolean }>, container: HTMLElement) {
  const id = node.id.substring(0, 13);
  const newDiv = createDivWithText(id);
  newDiv.classList.add('rectangle', 'example-node');
  if (node.diagrammerData.selected) {
    newDiv.classList.add('selected');
  }
  if (node.consumerData) {
    if (node.consumerData.odd) {
      newDiv.classList.add('odd');
    } else {
      newDiv.classList.add('even');
    }
  }
  container.innerHTML = '';
  container.appendChild(newDiv);
  return newDiv;
}

export function createRectangularConnectorNode(node: DiagrammerNode<{ odd?: boolean }>, container: HTMLElement) {
  const id = node.id.substring(0, 13);
  const newDiv = createDivWithText(id);
  newDiv.classList.add('rectangle', 'example-node', 'connector-node');
  if (node.diagrammerData.selected) {
    newDiv.classList.add('selected');
  }
  container.innerHTML = '';
  const connectorDiv = document.createElement('div');
  connectorDiv.classList.add('outer', 'outer-rectangle');
  connectorDiv.setAttribute('data-id', node.id);
  connectorDiv.setAttribute('data-type', 'Diagrammer.Connector');
  connectorDiv.setAttribute('data-draggable', 'true');
  connectorDiv.setAttribute('data-event-target', 'true');
  newDiv.setAttribute('data-id', node.id);
  newDiv.setAttribute('data-type', 'Diagrammer.Connector');
  newDiv.setAttribute('data-dropzone', 'true');
  container.appendChild(connectorDiv);
  container.appendChild(newDiv);
  return newDiv;
}

export function createNodeWithInput(node: DiagrammerNode<any>, container: HTMLElement) {
  if (container.innerHTML !== '') {
    const childDiv = container.children[0];
    if (node.diagrammerData.selected) {
      childDiv.classList.add('selected');
    } else {
      childDiv.classList.remove('selected');
    }
    return undefined;
  }
  const newDiv = document.createElement('div');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('data-event-target', 'true');
  input.setAttribute('data-draggable', 'true');
  newDiv.appendChild(input);
  newDiv.classList.add('rectangle', 'example-node');
  if (node.diagrammerData.selected) {
    newDiv.classList.add('selected');
  }
  container.appendChild(newDiv);
  return newDiv;
}

export function createNodeWithDropdown(node: DiagrammerNode<any>, container: HTMLElement) {
  if (container.innerHTML !== '') {
    const childDiv = container.children[0];
    if (node.diagrammerData.selected) {
      childDiv.classList.add('selected');
    } else {
      childDiv.classList.remove('selected');
    }
    return undefined;
  }
  const newDiv = document.createElement('div');
  const select = document.createElement('select');
  const option = document.createElement('option');
  const optionValue = document.createTextNode('test');
  option.appendChild(optionValue);
  select.appendChild(option);
  select.setAttribute('type', 'text');
  select.setAttribute('data-event-target', 'true');
  newDiv.appendChild(select);
  newDiv.classList.add('rectangle', 'example-node');
  if (node.diagrammerData.selected) {
    newDiv.classList.add('selected');
  }
  container.appendChild(newDiv);
  return newDiv;
}

export function createCircularNode(node: DiagrammerNode<any>, container: HTMLElement) {
  const id = node.id.substring(0, 13);
  const newDiv = createDivWithText(id);
  newDiv.classList.add('circle', 'example-node');
  if (node.diagrammerData.selected) {
    newDiv.classList.add('selected');
  }
  container.innerHTML = '';
  const connectorDiv = document.createElement('div');
  connectorDiv.classList.add('outer');
  connectorDiv.setAttribute('data-id', node.id);
  connectorDiv.setAttribute('data-type', 'Diagrammer.Connector');
  connectorDiv.setAttribute('data-draggable', 'true');
  connectorDiv.setAttribute('data-event-target', 'true');
  newDiv.setAttribute('data-id', node.id);
  newDiv.setAttribute('data-type', 'Diagrammer.Connector');
  newDiv.setAttribute('data-dropzone', 'true');
  container.appendChild(connectorDiv);
  container.appendChild(newDiv);
  return newDiv;
}

export function createContextMenu(text: string) {
  const newDiv = createDivWithText(text);
  newDiv.classList.add('contextMenu');
  return newDiv;
}

export function createNodeContextMenu(id: string | undefined, container: HTMLElement) {
  if (!id) {
    return;
  }
  container.innerHTML = '';
  container.appendChild(createContextMenu(`This is the node: ${id}`));
}

export function createEdgeContextMenu(id: string | undefined, container: HTMLElement) {
  if (!id) {
    return;
  }
  container.innerHTML = '';
  container.appendChild(createContextMenu(`This is the edge: ${id}`));
}

export function createPanelContextMenu(id: string | undefined, container: HTMLElement) {
  if (!id) {
    return;
  }
  container.innerHTML = '';
  container.appendChild(createContextMenu(`This is the panel: ${id}`));
}

export function createWorkspaceContextMenu(container: HTMLElement) {
  container.innerHTML = '';
  container.appendChild(createContextMenu('This is the workspace'));
}

export function createPanelNode(testId: string, text: string, size?: Size) {
  const newDiv = createDivWithText(text);
  newDiv.classList.add('rectangle', 'example-node', 'potential-node');
  newDiv.setAttribute('data-id', testId);
  newDiv.setAttribute('data-type', 'Diagrammer.PotentialNode');
  newDiv.setAttribute('data-draggable', 'true');
  newDiv.setAttribute('data-event-target', 'true');
  if (size) {
    newDiv.setAttribute('data-width', `${size.width}`);
    newDiv.setAttribute('data-height', `${size.height}`);
  }
  return newDiv;
}

export function createLibraryPanel(container: HTMLElement) {
  if (container.innerHTML !== '') {
    return undefined;
  }

  const newDiv = document.createElement('div');
  newDiv.setAttribute('data-event-target', 'true');
  newDiv.setAttribute('data-dropzone', 'true');
  newDiv.classList.add('library');

  // Create element that is draggable at the top of the panel
  const draggableElement = document.createElement('div');
  draggableElement.innerText = 'drag here';
  draggableElement.classList.add('draggableElement');
  draggableElement.setAttribute('data-event-target', 'true');
  draggableElement.setAttribute('data-draggable', 'true');
  draggableElement.setAttribute('data-type', 'Diagrammer.PanelDragHandle');
  draggableElement.setAttribute('data-id', 'library');

  newDiv.appendChild(draggableElement);

  newDiv.appendChild(createPanelNode('testId-normal', 'Normal'));
  newDiv.appendChild(createPanelNode('testId-normalWithSize', 'Normal with Size', { width: 100, height: 50 }));
  newDiv.appendChild(createPanelNode('testId-topBottom', 'Top Bottom'));
  newDiv.appendChild(createPanelNode('testId-centered', 'Centered'));
  newDiv.appendChild(createPanelNode('testId-start', 'Start Node'));
  newDiv.appendChild(createPanelNode('testId-end', 'End Node'));
  newDiv.appendChild(createPanelNode('testId-dead', 'Dead Node'));
  newDiv.appendChild(createPanelNode('testId-input', 'With Input'));
  newDiv.appendChild(createPanelNode('testId-dropdown', 'With Dropdown'));
  container.appendChild(newDiv);
  return newDiv;
}

function createToolButton(text: string, eventListener: () => void) {
  const newDiv = createDivWithText(text);
  newDiv.setAttribute('data-type', 'Diagrammer.Tools');
  newDiv.setAttribute('data-id', text);
  newDiv.addEventListener('click', eventListener);
  return newDiv;
}

function createUpdateContainerButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('UpdateContainer', () => {
    getDiagrammerObj().updateContainer();
  });
}

function createDestroyButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Destroy', () => {
    getDiagrammerObj().destroy();
  });
}

function createDragToolButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Drag', () => {
    getDiagrammerObj().api.setEditorMode(EditorMode.DRAG);
  });
}

function createSelectToolButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Select', () => {
    getDiagrammerObj().api.setEditorMode(EditorMode.SELECT);
  });
}

function createReadOnlyToolButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('ReadOnly', () => {
    getDiagrammerObj().api.setEditorMode(EditorMode.READ_ONLY);
  });
}

function createFocusNodeButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('FocusNode', () => {
    getDiagrammerObj().api.focusNode('node1');
  });
}

function createFocusSelectedButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('FocusSelected', () => {
    getDiagrammerObj().api.focusSelected();
  });
}

function createFitButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Fit', () => {
    getDiagrammerObj().api.fit();
  });
}

function createZoomInButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('ZoomIn', () => {
    getDiagrammerObj().api.zoomIn();
  });
}

function createZoomOutButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('ZoomOut', () => {
    getDiagrammerObj().api.zoomOut();
  });
}

function createResetZoomButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('ResetZoom', () => {
    getDiagrammerObj().api.resetZoom();
  });
}

function createUndoButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Undo', () => {
    getDiagrammerObj().api.undo();
  });
}

function createRedoButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('Redo', () => {
    getDiagrammerObj().api.redo();
  });
}

function createWorkflowLayoutButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('WorkflowLayout', () => {
    getDiagrammerObj().api.layout({
      direction: WorkflowLayoutDirection.LEFT_RIGHT,
      distanceMin: 200,
      layoutType: Layout.WORKFLOW,
    });
  });
}

function createHierarchicalLayoutButton(getDiagrammerObj: () => Diagrammer) {
  return createToolButton('HierarchicalLayout', () => {
    getDiagrammerObj().api.layout({
      distanceMin: 200,
      fixedNodeIds: ['node1'],
      layoutType: Layout.HIERARCHICAL,
    });
  });
}

function createTestInput() {
  const div = document.createElement('div');
  const input = document.createElement('input');
  input.classList.add('testInput');
  input.setAttribute('data-type', 'Diagrammer.Tools');
  input.setAttribute('data-id', 'TestInput');
  input.setAttribute('type', 'text');
  div.appendChild(input);
  return div;
}

export function createToolsPanel(container: HTMLElement, getDiagrammerObj: () => Diagrammer) {
  if (container.innerHTML !== '') {
    return;
  }

  const newDiv = document.createElement('div');
  newDiv.classList.add('tools');

  newDiv.appendChild(createUpdateContainerButton(getDiagrammerObj));
  newDiv.appendChild(createDestroyButton(getDiagrammerObj));
  newDiv.appendChild(createDragToolButton(getDiagrammerObj));
  newDiv.appendChild(createSelectToolButton(getDiagrammerObj));
  newDiv.appendChild(createReadOnlyToolButton(getDiagrammerObj));
  newDiv.appendChild(createFocusNodeButton(getDiagrammerObj));
  newDiv.appendChild(createFocusSelectedButton(getDiagrammerObj));
  newDiv.appendChild(createFitButton(getDiagrammerObj));
  newDiv.appendChild(createZoomInButton(getDiagrammerObj));
  newDiv.appendChild(createZoomOutButton(getDiagrammerObj));
  newDiv.appendChild(createResetZoomButton(getDiagrammerObj));
  newDiv.appendChild(createUndoButton(getDiagrammerObj));
  newDiv.appendChild(createRedoButton(getDiagrammerObj));
  newDiv.appendChild(createWorkflowLayoutButton(getDiagrammerObj));
  newDiv.appendChild(createHierarchicalLayoutButton(getDiagrammerObj));
  newDiv.appendChild(createTestInput());

  container.appendChild(newDiv);
}

export function createPluginPanel(container: HTMLElement, state: any) {
  if (container.innerHTML !== '') {
    return undefined;
  }

  const newDiv = document.createElement('div');
  newDiv.setAttribute('data-event-target', 'true');
  newDiv.setAttribute('data-dropzone', 'true');
  newDiv.classList.add('library');

  // Create element that is draggable at the top of the panel
  const draggableElement = document.createElement('div');
  draggableElement.innerText = 'drag here';
  draggableElement.classList.add('draggableElement');
  draggableElement.setAttribute('data-event-target', 'true');
  draggableElement.setAttribute('data-draggable', 'true');
  draggableElement.setAttribute('data-type', 'Diagrammer.PanelDragHandle');
  draggableElement.setAttribute('data-id', 'plugin');
  newDiv.appendChild(draggableElement);

  // Create a plugin that can drag workspace to a target position
  const testPlugin = createDivWithText('Click this plugin to move workspace to a target position');
  testPlugin.setAttribute('data-event-target', 'true');
  testPlugin.setAttribute('data-type', 'testPlugin');
  testPlugin.setAttribute('data-id', 'testPlugin');
  const { width } = state.plugins.testPlugin.data.size;
  const { height } = state.plugins.testPlugin.data.size;
  testPlugin.style.width = `${width}px`;
  testPlugin.style.height = `${height}px`;
  testPlugin.style.backgroundColor = 'orange';
  testPlugin.style.paddingTop = '15px';
  testPlugin.style.textAlign = 'center';
  newDiv.appendChild(testPlugin);

  container.appendChild(newDiv);
  return newDiv;
}

export function handleTestPluginEvent(event: any, diagrammer: any) {
  if (event.type === Event.LEFT_CLICK && event.target.type === 'testPlugin') {
    const state = diagrammer.store.getState();
    if (!state.plugins) return;
    const position = state.plugins.testPlugin.data.workspacePos;

    diagrammer.api.dispatch({
      payload: { position },
      type: WorkspaceActions.WORKSPACE_DRAG,
    });
  }
}

export function updateActionInLogger(action: Action) {
  const anyAction = action as AnyAction;
  const logger = document.getElementById('diagrammerLogger');
  if (logger) {
    const type = createDivWithText(`Type is ${action.type}`);
    type.setAttribute('data-type', 'Diagrammer.ActionType');
    type.setAttribute('data-id', action.type);
    logger.innerHTML = '';
    logger.appendChild(type);
    if (anyAction.payload) {
      const payload = createDivWithText(`Payload is ${JSON.stringify(anyAction.payload)}`);
      payload.setAttribute('data-type', 'Diagrammer.ActionPayload');
      payload.setAttribute('data-id', action.type);
      logger.appendChild(payload);
    }
  }
}

export function addDevTools() {
  if (process.env.NODE_ENV === 'development') {
    const windowAsAny = window as any;
    // eslint-disable-next-line no-underscore-dangle
    return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
  }
  return undefined;
}

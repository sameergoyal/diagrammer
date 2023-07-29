import {
  ConnectorPlacement, Diagrammer, DiagrammerAction,
  DiagrammerActions, Shape, VisibleConnectorTypes,
} from 'diagrammer/index';
import {
  ConnectorPlacementType, ContextMenuRenderCallbacks, ShapeType,
} from 'diagrammer/service/ConfigService';
import { CreateEdgeAction } from 'diagrammer/state/edge/edgeActions';
import {
  DiagrammerData, DiagrammerEdge, DiagrammerNode, DiagrammerPotentialNode,
} from 'diagrammer/state/types';
import 'preact/devtools';
import { Action, Dispatch } from 'redux';

import ActionInterceptorData from './ActionInterceptor/data';
import BoundaryCircularData from './BoundaryCircular/data';
import BoundaryRectangularData from './BoundaryRectangular/data';
import DarkThemeData from './DarkTheme/data';
import LayoutData from './Layout/data';
import LeftRightRectangularData from './LeftRightRectangular/data';
import PluginsData from './Plugins/data';
import TopBottomRectangularData from './TopBottomRectangular/data';
import {
  addDevTools, createCircularNode, createEdgeContextMenu, createLibraryPanel, createNodeContextMenu,
  createNodeWithDropdown, createNodeWithInput, createPanelContextMenu, createPluginPanel, createPotentialNode,
  createRectangularConnectorNode, createRectangularNode, createToolsPanel, createWorkspaceContextMenu,
  handleTestPluginEvent, updateActionInLogger,
} from './utils';

import './scss/CircularNode.scss';
import './scss/Logger.scss';
import './scss/RectangularNode.scss';

export default {
  title: 'Demos/Diagrammer',
  argTypes: {
    onAction: {
      action: 'action',
    },
  },
};

const createDivWithId = (id: string) => {
  const container = document.createElement('div');
  container.id = id;
  return container;
};

interface ArgTypes {
  initialData: DiagrammerData<{}, {}>;
  connectorPlacement?: ConnectorPlacementType;
  showArrowhead?: boolean;
  shape?: ShapeType;
  edgeBadge?: boolean;
  darkTheme?: boolean;
  actionInterceptor?: boolean;
  plugin?: boolean;
  onAction: (...args: any) => void;
}

const Template = ({
  initialData,
  connectorPlacement,
  showArrowhead,
  shape,
  edgeBadge,
  darkTheme,
  actionInterceptor,
  plugin,
  onAction,
}: ArgTypes) => {
  const dmContainer = createDivWithId('diagrammerContainer');
  const logger = createDivWithId('diagrammerLogger');
  const root = createDivWithId('diagrammerRoot');
  root.appendChild(dmContainer);
  root.appendChild(logger);
  if (darkTheme) {
    document.body.classList.add('dm-dark-theme');
  } else {
    document.body.classList.remove('dm-dark-theme');
  }
  const windowAsAny = window as any;
  windowAsAny.diagrammer = new Diagrammer(
    dmContainer,
    {
      options: {
        connectorPlacement: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
        showArrowhead: showArrowhead || false,
      },
      renderCallbacks: {
        destroy: () => undefined,
        node: (node: DiagrammerNode<{}>, container: HTMLElement) => {
          if (node.typeId === 'testId-centered') {
            return createCircularNode(node, container);
          }
          if (node.typeId === 'testId-input') {
            return createNodeWithInput(node, container);
          }
          if (node.typeId === 'testId-dropdown') {
            return createNodeWithDropdown(node, container);
          }
          if (connectorPlacement === ConnectorPlacement.BOUNDARY) {
            if (shape === Shape.CIRCLE) {
              return createCircularNode(node, container);
            }
            return createRectangularConnectorNode(node, container);
          }
          return createRectangularNode(node, container);
        },
        edge: edgeBadge ? (edge: DiagrammerEdge<{}>, container: HTMLElement): HTMLElement | undefined => {
          if (container.innerHTML === '') {
            const element = document.createElement('div');
            element.textContent = edge.id.substring(0, 10);
            element.classList.add('edgeBadge');
            container.appendChild(element);
            return element;
          }
          return undefined;
        } : undefined,
        potentialNode:
          (node: DiagrammerPotentialNode, container: HTMLElement) => createPotentialNode(node, container),
        panels: {
          library: (panel: any, state: any, container: HTMLElement) => createLibraryPanel(container),
          ...(plugin && {
            plugin: (
              panel: any,
              state: any,
              container: HTMLElement,
            ) => createPluginPanel(container, state),
          }),
          ...(!plugin && {
            tools: (
              panel: any,
              state: any,
              container: HTMLElement,
            ) => createToolsPanel(container, () => windowAsAny.diagrammer),
          }),
        },
        contextMenu: {
          node: (id: string | undefined, container: HTMLElement) => createNodeContextMenu(id, container),
          edge: (id: string | undefined, container: HTMLElement) => createEdgeContextMenu(id, container),
          panel: (id: string | undefined, container: HTMLElement) => createPanelContextMenu(id, container),
          workspace: (container: HTMLElement) => createWorkspaceContextMenu(container),
        } as ContextMenuRenderCallbacks,
      },
      actionInterceptor: (action: Action, next: Dispatch<Action>, getState: () => DiagrammerData<{}, {}>) => {
        onAction(action);
        if (actionInterceptor) {
          const diagrammerAction = action as DiagrammerAction<{ odd: boolean }, {}>;
          updateActionInLogger(action);
          if (diagrammerAction.type === DiagrammerActions.DELETE_ITEMS
                && diagrammerAction.payload.nodeIds.length > 0) {
            return;
          }

          if (diagrammerAction.type === DiagrammerActions.NODE_CREATE) {
            // nodes before are even so this odd
            diagrammerAction.payload.consumerData = {
              odd: Object.keys(getState().nodes).length % 2 === 0,
            };
            next(diagrammerAction);
            return;
          }

          if (diagrammerAction.type === DiagrammerActions.EDGE_CREATE) {
            next(diagrammerAction);
            const newAction: CreateEdgeAction<{}> = {
              type: DiagrammerActions.EDGE_CREATE,
              payload: {
                id: `${diagrammerAction.payload.id}-2`,
                src: diagrammerAction.payload.dest,
                dest: diagrammerAction.payload.src,
              },
            };
            setTimeout(() => next(newAction), 1000);
          }
          next(action);
        } else {
          updateActionInLogger(action);
          next(action);
        }
      },
      nodeTypeConfig: {
        'testId-centered': {
          size: { width: 100, height: 100 },
          connectorPlacementOverride: ConnectorPlacement.CENTERED,
        },
        'testId-dead': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
          visibleConnectorTypes: VisibleConnectorTypes.NONE,
        },
        'testId-dropdown': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
        },
        'testId-end': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
          visibleConnectorTypes: VisibleConnectorTypes.INPUT_ONLY,
        },
        'testId-input': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
        },
        'testId-normal': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
          shape: shape || Shape.RECTANGLE,
        },
        'testId-normalWithSize': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
          shape: shape || Shape.RECTANGLE,
        },
        'testId-start': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
          visibleConnectorTypes: VisibleConnectorTypes.OUTPUT_ONLY,
        },
        'testId-topBottom': {
          size: { width: 150, height: 50 },
          connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM,
        },
      },
    },
    {
      consumerEnhancer: addDevTools(),
      eventListener: plugin ? (event) => {
        handleTestPluginEvent(event, windowAsAny.diagrammer);
      } : undefined,
      initialData,
    },
  );
  return root;
};

export const ActionInterceptor: any = Template.bind({});
ActionInterceptor.args = {
  initialData: ActionInterceptorData,
  actionInterceptor: true,
};
ActionInterceptor.play = () => (window as any).diagrammer.updateContainer();

export const BoundaryCircular: any = Template.bind({});
BoundaryCircular.args = {
  initialData: BoundaryCircularData,
  connectorPlacement: ConnectorPlacementType.BOUNDARY,
  showArrowhead: true,
  shape: Shape.CIRCLE,
  edgeBadge: true,
};
BoundaryCircular.play = () => (window as any).diagrammer.updateContainer();

export const BoundaryRectangular: any = Template.bind({});
BoundaryRectangular.args = {
  initialData: BoundaryRectangularData,
  connectorPlacement: ConnectorPlacementType.BOUNDARY,
  showArrowhead: true,
  shape: Shape.RECTANGLE,
  edgeBadge: true,
};
BoundaryRectangular.play = () => (window as any).diagrammer.updateContainer();

export const DarkTheme: any = Template.bind({});
DarkTheme.args = {
  darkTheme: true,
  initialData: DarkThemeData,
};
DarkTheme.play = () => (window as any).diagrammer.updateContainer();

export const Layout: any = Template.bind({});
Layout.args = {
  initialData: LayoutData,
};
Layout.play = () => (window as any).diagrammer.updateContainer();

export const LeftRightRectangular: any = Template.bind({});
LeftRightRectangular.args = {
  initialData: LeftRightRectangularData,
  connectorPlacement: ConnectorPlacementType.LEFT_RIGHT,
};
LeftRightRectangular.play = () => (window as any).diagrammer.updateContainer();

export const Plugins: any = Template.bind({});
Plugins.args = {
  initialData: PluginsData,
  plugin: true,
};
Plugins.play = () => (window as any).diagrammer.updateContainer();

export const TopBottomRectangular: any = Template.bind({});
TopBottomRectangular.args = {
  initialData: TopBottomRectangularData,
  connectorPlacement: ConnectorPlacementType.TOP_BOTTOM,
};
TopBottomRectangular.play = () => (window as any).diagrammer.updateContainer();

import { EditorMode, PositionAnchor } from 'diagrammer/index';
import { DiagrammerData } from 'diagrammer/state/types';

const graph: DiagrammerData<{}, {}> = {
  nodes: {
    node1: {
      id: 'node1',
      typeId: 'testId-normal',
      diagrammerData: {
        position: { x: 200, y: 150 },
        size: { width: 100, height: 100 },
      },
    },
    node2: {
      id: 'node2',
      typeId: 'testId-normal',
      diagrammerData: {
        position: { x: 400, y: 300 },
        size: { width: 100, height: 100 },
      },
    },
    node3: {
      id: 'node3',
      typeId: 'testId-normal',
      diagrammerData: {
        position: { x: 600, y: 100 },
        size: { width: 100, height: 100 },
      },
    },
    node4: {
      id: 'node4',
      typeId: 'testId-normal',
      diagrammerData: {
        position: { x: 800, y: 150 },
        size: { width: 100, height: 100 },
      },
    },
  },
  edges: {
    edge1: {
      id: 'edge1',
      src: 'node1',
      dest: 'node2',
      diagrammerData: { },
    },
    edge2: {
      id: 'edge2',
      src: 'node3',
      dest: 'node4',
      diagrammerData: { },
    },
    edge3: {
      id: 'edge3',
      src: 'node4',
      dest: 'node3',
      diagrammerData: { },
    },
  },
  panels: {
    library: {
      id: 'library',
      position: { x: 20, y: 20 },
      size: { width: 250, height: 600 },
      positionAnchor: PositionAnchor.TOP_RIGHT,
    },
    tools: {
      id: 'tools',
      position: { x: 20, y: 20 },
      size: { width: 150, height: 400 },
    },
  },
  workspace: {
    position: { x: 0, y: 0 },
    scale: 1,
    canvasSize: { width: 3200, height: 1600 },
    viewContainerSize: { width: window.innerWidth, height: window.innerHeight },
  },
  editor: { mode: EditorMode.DRAG },
};

export default graph;

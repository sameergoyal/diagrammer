import {
  DiagrammerEdge, DiagrammerEdges, DiagrammerNode, DiagrammerNodes,
} from 'diagrammer/state/types';

import { createDeleteItemsAction, createNewItemsAction, handleDeleteSelectedItems } from './globalActionDispatcher';
import { GlobalActionsType } from './globalActions';

const position = { x: 0, y: 0 };
const size = { width: 100, height: 20 };

describe('globalActionDispatcher', () => {
  describe('createDeleteItemsAction', () => {
    it('returns delete items action', () => {
      const nodeIds = ['node-1', 'node-2'];
      const edgeIds = ['edge-1', 'edge-2'];
      expect(createDeleteItemsAction(nodeIds, edgeIds)).toEqual({
        payload: {
          edgeIds,
          nodeIds,
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });
  });

  describe('createNewItemsAction', () => {
    it('returns create items action', () => {
      const nodes: DiagrammerNode<{}>[] = [
        {
          id: 'node-1',
          diagrammerData: { position, size, selected: false },
        },
        {
          id: 'node-2',
          diagrammerData: { position, size, selected: true },
        },
      ];
      const edges: DiagrammerEdge<{}>[] = [
        {
          id: 'edge-1',
          src: 'node-1',
          dest: 'node-2',
          diagrammerData: {
            selected: true,
          },
        },
        {
          id: 'edge-2',
          src: 'node-2',
          dest: 'node-1',
          diagrammerData: {
            selected: false,
          },
        },
      ];
      expect(createNewItemsAction(nodes, edges)).toEqual({
        payload: {
          edges,
          nodes,
        },
        type: GlobalActionsType.CREATE_ITEMS,
      });
    });
  });

  describe('handleDeleteSelectedItems', () => {
    it('includes selected node IDs', () => {
      const nodes: DiagrammerNodes<{}> = {
        'node-1': {
          id: 'node-1',
          diagrammerData: { position, size, selected: false },
        },
        'node-2': {
          id: 'node-2',
          diagrammerData: { position, size, selected: true },
        },
      };
      const edges: DiagrammerEdges<{}> = {};
      const dispatch = jest.fn();

      const store: any = {
        dispatch,
        getState: () => ({
          edges,
          nodes,
        }),
      };

      handleDeleteSelectedItems(store);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          edgeIds: [],
          nodeIds: ['node-2'],
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });

    it('includes selected edge IDs', () => {
      const nodes: DiagrammerNodes<{}> = {
        'node-1': {
          id: 'node-1',
          diagrammerData: { position, size },
        },
        'node-2': {
          id: 'node-2',
          diagrammerData: { position, size },
        },
      };

      const edges: DiagrammerEdges<{}> = {
        'edge-1': {
          id: 'edge-1',
          src: 'node-1',
          dest: 'node-2',
          diagrammerData: {
            selected: true,
          },
        },
        'edge-2': {
          id: 'edge-2',
          src: 'node-2',
          dest: 'node-1',
          diagrammerData: {
            selected: false,
          },
        },
      };

      const dispatch = jest.fn();

      const store: any = {
        dispatch,
        getState: () => ({
          edges,
          nodes,
        }),
      };

      handleDeleteSelectedItems(store);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          edgeIds: ['edge-1'],
          nodeIds: [],
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });

    it('includes IDs for edges whose source node was deleted (partially stranded)', () => {
      const nodes: DiagrammerNodes<{}> = {
        'node-1': {
          id: 'node-1',
          diagrammerData: { position, size },
        },
        'node-2': {
          id: 'node-2',
          diagrammerData: { position, size },
        },
        'node-3': {
          id: 'node-3',
          diagrammerData: { position, size, selected: true },
        },
      };

      const edges: DiagrammerEdges<{}> = {
        'edge-1': {
          id: 'edge-1',
          src: 'node-3',
          dest: 'node-1',
          diagrammerData: {
            selected: false,
          },
        },
        'edge-2': {
          id: 'edge-2',
          src: 'node-1',
          dest: 'node-2',
          diagrammerData: {
            selected: false,
          },
        },
      };

      const dispatch = jest.fn();

      const store: any = {
        dispatch,
        getState: () => ({
          edges,
          nodes,
        }),
      };

      handleDeleteSelectedItems(store);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          edgeIds: ['edge-1'],
          nodeIds: ['node-3'],
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });

    it('includes IDs for edges whose destination node was deleted (partially stranded)', () => {
      const nodes: DiagrammerNodes<{}> = {
        'node-1': {
          id: 'node-1',
          diagrammerData: { position, size },
        },
        'node-2': {
          id: 'node-2',
          diagrammerData: { position, size },
        },
        'node-3': {
          id: 'node-3',
          diagrammerData: { position, size, selected: true },
        },
      };

      const edges: DiagrammerEdges<{}> = {
        'edge-1': {
          id: 'edge-1',
          src: 'node-1',
          dest: 'node-3',
          diagrammerData: {
            selected: false,
          },
        },
        'edge-2': {
          id: 'edge-2',
          src: 'node-1',
          dest: 'node-2',
          diagrammerData: {
            selected: false,
          },
        },
      };

      const dispatch = jest.fn();

      const store: any = {
        dispatch,
        getState: () => ({
          edges,
          nodes,
        }),
      };

      handleDeleteSelectedItems(store);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          edgeIds: ['edge-1'],
          nodeIds: ['node-3'],
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });

    it('includes IDs for edges whose source and destination nodes were deleted (completely stranded)', () => {
      const nodes: DiagrammerNodes<{}> = {
        'node-1': {
          id: 'node-1',
          diagrammerData: { position, size, selected: true },
        },
        'node-2': {
          id: 'node-2',
          diagrammerData: { position, size, selected: true },
        },
        'node-3': {
          id: 'node-3',
          diagrammerData: { position, size },
        },
      };

      const edges: DiagrammerEdges<{}> = {
        'edge-1': {
          id: 'edge-1',
          src: 'node-3',
          dest: 'node-3',
          diagrammerData: {
            selected: false,
          },
        },
        'edge-2': {
          id: 'edge-2',
          src: 'node-1',
          dest: 'node-2',
          diagrammerData: {
            selected: false,
          },
        },
      };

      const dispatch = jest.fn();

      const store: any = {
        dispatch,
        getState: () => ({
          edges,
          nodes,
        }),
      };

      handleDeleteSelectedItems(store);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          edgeIds: ['edge-2'],
          nodeIds: ['node-1', 'node-2'],
        },
        type: GlobalActionsType.DELETE_ITEMS,
      });
    });
  });
});

import { DiagrammerWorkspace, EditorMode } from 'diagrammer/state/types';
import { getDefaultWorkspaceState } from 'diagrammer/state/workspace';
import { asMock } from 'diagrammer/testing/testUtils';
import getInitialState from './getInitialState';

jest.mock('diagrammer/state/workspace', () => ({
  getDefaultWorkspaceState: jest.fn(),
}));

describe('getInitialState', () => {
  it('collects initial state from the defaults used in slice reducers', () => {
    const workspaceState: DiagrammerWorkspace = {
      position: { x: 250, y: 250 },
      scale: 1.5,
      canvasSize: { width: 1000, height: 1000 },
      viewContainerSize: { width: 500, height: 500 },
    };
    asMock(getDefaultWorkspaceState).mockImplementationOnce(() => workspaceState);

    expect(getInitialState()).toEqual({
      edges: {},
      editor: {
        mode: EditorMode.DRAG,
      },
      nodes: {},
      panels: {},
      workspace: workspaceState,
    });
  });
});

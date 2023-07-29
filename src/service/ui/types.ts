export enum DiagrammerComponentsType {
  /**
   * Used on context menus rendered by diagrammer.
   * For internal use only.
   */
  CONTEXT_MENU = 'Diagrammer.ContextMenu',
  /**
   * Used on edges rendered by diagrammer.
   * For internal use only.
   */
  EDGE = 'Diagrammer.Edge',
  /**
   * Used on edge badges rendered by diagrammer.
   * For internal use only.
   */
  EDGE_BADGE = 'Diagrammer.EdgeBadge',
  /**
   * Used on potential edges rendered by diagrammer.
   * For internal use only.
   */
  POTENTIAL_EDGE = 'Diagrammer.PotentialEdge',
  /**
   * Used on potential nodes being dragged currently by diagrammer.
   * Also used by consumers on the drag targets for potential nodes.
   */
  POTENTIAL_NODE = 'Diagrammer.PotentialNode',
  /**
   * Used on nodes rendered by diagrammer.
   * For internal use only.
   */
  NODE = 'Diagrammer.Node',
  /**
   * Used on node connectors displayed by diagrammer.
   * Can also be used within the node to make the entire node,
   * or parts of the node DOM be droppable for completion of edge creation
   * or draggable for starting edge creation.
   */
  NODE_CONNECTOR = 'Diagrammer.Connector',
  /**
   * Used on panels rendered by diagrammer.
   * For internal use only.
   */
  PANEL = 'Diagrammer.Panel',

  /**
   * Used as a drag handle on panels rendered by diagrammer.
   * If you give an element this data-type in the panel render callback
   * dragging this element will drag the panel
   */
  PANEL_DRAG_HANDLE = 'Diagrammer.PanelDragHandle',

  /**
   * Used on selection marquee rendered by diagrammer in select mode.
   * For internal use only.
   */
  SELECTION_MARQUEE = 'Diagrammer.SelectionMarquee',

  /**
   * Used on top level container rendered by diagrammer.
   * For internal use only.
   */
  VIEW = 'Diagrammer.View',

  /**
   * Used on workspace rendered by diagrammer.
   * For internal use only.
   */
  WORKSPACE = 'Diagrammer.Workspace',
}

export const DiagrammerComponents = {
  ...DiagrammerComponentsType,
};

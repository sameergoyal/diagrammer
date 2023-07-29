// Object.values() polyfill
// TODO: import polyfills instead of bundling it
import 'diagrammer/polyfills/object-values';

import {
  Action, Reducer, Store, StoreEnhancer,
} from 'redux';

import { destroy, render } from 'diagrammer/components/renderUtils';
import ConfigService, { DiagrammerConfig } from 'diagrammer/service/ConfigService';
import DiagrammerApi from 'diagrammer/service/DiagrammerApi';
import Observer, { ObserverCallback } from 'diagrammer/service/observer/Observer';
import UIEventManager, {
  ContainerEventType,
  DestroyEventType,
} from 'diagrammer/service/ui/UIEventManager';
import UIEventNormalizer from 'diagrammer/service/ui/UIEventNormalizer';
import ActionDispatcher from 'diagrammer/state/ActionDispatcher';
import createStore from 'diagrammer/state/createStore';
import { DiagrammerData } from 'diagrammer/state/types';

/**
 * Top Level Diagrammer Class.
 * Instantiate to render a diagrammer instance within a container.
 * @class
 */
export default class Diagrammer<NodeType = {}, EdgeType = {}> {
  /**
   * Diagrammer store.
   * Currently used for dispatching, fetching state & listening to updates.
   * Will be moved to API and closed out.
   */
  public readonly store: Store<DiagrammerData<NodeType, EdgeType>>;

  /**
   * Diagrammer APIs.
   */
  public readonly api: DiagrammerApi<NodeType, EdgeType>;

  private config: ConfigService<NodeType, EdgeType>;

  private container: HTMLElement;

  private actionDispatcher: ActionDispatcher<NodeType, EdgeType>;

  private observer: Observer;

  private eventManager: UIEventManager;

  constructor(
    domHandle: string | HTMLElement,
    config: DiagrammerConfig<NodeType, EdgeType>,
    {
      initialData, consumerRootReducer, consumerEnhancer, eventListener,
    }: {
      initialData?: DiagrammerData<NodeType, EdgeType>,
      consumerRootReducer?: Reducer<DiagrammerData<NodeType, EdgeType>, Action>,
      consumerEnhancer?: StoreEnhancer,
      eventListener?: ObserverCallback;
    } = {},
  ) {
    this.config = new ConfigService(config);
    this.store = createStore(initialData, consumerRootReducer, consumerEnhancer, this.config.getActionInterceptor());
    this.api = new DiagrammerApi(this.store);

    this.container = Diagrammer.getContainer(domHandle);
    this.observer = new Observer();
    if (eventListener) {
      this.observer.subscribeAll(eventListener);
    }
    this.eventManager = new UIEventManager(this.observer, this.container);
    this.actionDispatcher = new ActionDispatcher(this.observer, this.store, this.config);

    render<NodeType, EdgeType>(this.store, this.container, this.config);

    this.updateContainer();
  }

  /**
   * API called to update diagrammer about container size changes.
   * Should be called when the window resizes or panels outside of diagrammer
   * opening up to cause changes to container size.
   *
   * This is used for several calculations, so dragging & other interactions might be broken
   * if this API is not called appropriately.
   */
  public updateContainer = () => {
    const normalizedEvent = UIEventNormalizer.normalizeContainerEvent(this.container);
    this.observer.publish(ContainerEventType.DIAGRAMMER_CONTAINER_UPDATE, normalizedEvent);
  };

  /**
   * API called to clean up a diagrammer instance after the user navigates away from the page
   * or closes the workspace.
   *
   * This is used to clean up event handlers that diagrammer attaches to the container, so
   * it could lead to a memory leak if its not called. This is because DOM & event listeners
   * have a self loop so it never gets garbage collected automatically unless we remove the event
   * listeners.
   */
  public destroy = () => {
    this.observer.publish(DestroyEventType.DESTROY);
    destroy(this.container);
  };

  private static getContainer = (domHandle: string | HTMLElement) => {
    if (typeof domHandle !== 'string') {
      return domHandle;
    }
    const container = document.getElementById(domHandle);
    if (!container) {
      throw new Error('Container not found');
    }
    return container;
  };
}

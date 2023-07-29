import { destroy, render } from 'diagrammer/components/renderUtils';
import ConfigService from 'diagrammer/service/ConfigService';
import DiagrammerApi from 'diagrammer/service/DiagrammerApi';
import Observer from 'diagrammer/service/observer/Observer';
import UIEventManager, {
  ContainerEventType,
  DestroyEventType,
} from 'diagrammer/service/ui/UIEventManager';
import UIEventNormalizer from 'diagrammer/service/ui/UIEventNormalizer';
import ActionDispatcher from 'diagrammer/state/ActionDispatcher';
import createStore from 'diagrammer/state/createStore';
import { asMock } from 'diagrammer/testing/testUtils';

import { Diagrammer } from '.';

jest.mock('diagrammer/state/createStore', () => ({ default: jest.fn() }));
jest.mock('diagrammer/state/ActionDispatcher', () => ({ default: jest.fn() }));
jest.mock('diagrammer/service/observer/Observer', () => ({ default: jest.fn() }));
jest.mock('diagrammer/service/ui/UIEventManager', () => ({
  ContainerEventType: 'mockEvent',
  default: jest.fn(),
  DestroyEventType: 'mockEvent',
}));
jest.mock('diagrammer/service/ui/UIEventNormalizer', () => ({ default: { normalizeContainerEvent: jest.fn() } }));
jest.mock('diagrammer/components/renderUtils', () => ({ destroy: jest.fn(), render: jest.fn() }));
jest.mock('diagrammer/service/ConfigService', () => ({ default: jest.fn() }));
jest.mock('diagrammer/service/DiagrammerApi', () => ({ default: jest.fn() }));

const context = document.body;
let config: any;
let actionInterceptor: any;

describe('Diagrammer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    context.innerHTML = '';

    actionInterceptor = jest.fn();
    config = { actionInterceptor, connectorPlacement: 'Centered' };
  });

  describe('constructor', () => {
    it('instantiates config, store, api, observer, event manager, action dispatcher', () => {
      const containerHeight = 10;
      const containerWidth = 10;

      const mockConfigService = { getActionInterceptor: () => actionInterceptor };
      const mockObserver = { publish: jest.fn(), subscribeAll: jest.fn() };
      const mockEvent = { height: containerHeight, width: containerWidth };
      const mockStore = { dispatch: jest.fn() };
      const initialData: any = { nodes: { 'node-1': {} } };
      const consumerRootReducer = jest.fn();
      const consumerEnhancer = jest.fn();
      const eventListener = jest.fn();

      asMock(UIEventNormalizer.normalizeContainerEvent).mockReturnValueOnce(mockEvent);
      asMock(ConfigService as any).mockImplementationOnce(() => mockConfigService);
      asMock(Observer as any).mockImplementationOnce(() => mockObserver);
      asMock(createStore).mockImplementationOnce(() => mockStore);

      new Diagrammer(
        context,
        config,
        {
          consumerEnhancer,
          consumerRootReducer,
          eventListener,
          initialData,
        },
      );

      expect(ConfigService).toHaveBeenCalledWith(config);
      expect(createStore).toHaveBeenCalledWith(initialData, consumerRootReducer, consumerEnhancer, actionInterceptor);
      expect(DiagrammerApi).toHaveBeenCalledTimes(1);
      expect(DiagrammerApi).toHaveBeenCalledWith(mockStore);
      expect(Observer).toHaveBeenCalledTimes(1);
      expect(mockObserver.subscribeAll).toHaveBeenCalledWith(eventListener);
      expect(UIEventManager).toHaveBeenCalledWith(mockObserver, context);
      expect(ActionDispatcher).toHaveBeenCalledWith(mockObserver, mockStore, mockConfigService);
      expect(render).toHaveBeenCalledWith(mockStore, context, mockConfigService);
      expect(mockObserver.publish).toHaveBeenCalledWith(ContainerEventType.DIAGRAMMER_CONTAINER_UPDATE, mockEvent);
    });

    it('instantiates config, store, observer, event manager, action dispatcher when dom handle is string', () => {
      const mockConfigService = { getActionInterceptor: () => actionInterceptor };
      const mockObserver = { publish: jest.fn() };
      const mockStore = { dispatch: jest.fn() };

      asMock(ConfigService as any).mockImplementationOnce(() => mockConfigService);
      asMock(Observer as any).mockImplementationOnce(() => mockObserver);
      asMock(createStore).mockImplementationOnce(() => mockStore);

      const testId = 'test';
      const testContext = document.createElement('div');
      testContext.id = testId;
      context.appendChild(testContext);

      new Diagrammer(testId, config);

      expect(ConfigService).toHaveBeenCalledWith(config);
      expect(createStore).toHaveBeenCalledWith(undefined, undefined, undefined, actionInterceptor);
      expect(Observer).toHaveBeenCalledTimes(1);
      expect(UIEventManager).toHaveBeenCalledWith(mockObserver, testContext);
      expect(ActionDispatcher).toHaveBeenCalledWith(mockObserver, mockStore, mockConfigService);
      expect(render).toHaveBeenCalledWith(mockStore, testContext, mockConfigService);
    });

    it('throws error when no element with provided id is present on the page', () => {
      const mockConfigService = { getActionInterceptor: () => actionInterceptor };
      const testId = 'test';

      asMock(ConfigService as any).mockImplementationOnce(() => mockConfigService);

      expect(() => {
        new Diagrammer(testId, config);
      }).toThrowError('Container not found');
    });
  });

  describe('updateContainer', () => {
    it('calls observer.publish and normalizes container update event', () => {
      const containerHeight = 10;
      const containerWidth = 10;

      const mockEvent = { height: containerHeight, width: containerWidth };
      const mockObserver = { publish: jest.fn() };
      const mockConfigService = { getActionInterceptor: () => actionInterceptor };

      asMock(UIEventNormalizer.normalizeContainerEvent).mockReturnValueOnce(mockEvent);
      asMock(ConfigService as any).mockImplementationOnce(() => mockConfigService);
      asMock(Observer as any).mockImplementationOnce(() => mockObserver);

      const diagrammer = new Diagrammer(context, config);

      // Constructor calls updateContainer, so explicitly test here
      jest.clearAllMocks();
      asMock(UIEventNormalizer.normalizeContainerEvent).mockReturnValueOnce(mockEvent);
      diagrammer.updateContainer();

      expect(UIEventNormalizer.normalizeContainerEvent).toHaveBeenCalledTimes(1);
      expect(mockObserver.publish).toHaveBeenCalledWith(ContainerEventType.DIAGRAMMER_CONTAINER_UPDATE, mockEvent);
    });
  });

  describe('destroy', () => {
    it('calls destroy from renderUtils', () => {
      const mockObserver = { publish: jest.fn() };
      const mockConfigService = { getActionInterceptor: () => actionInterceptor };

      asMock(ConfigService as any).mockImplementationOnce(() => mockConfigService);
      asMock(Observer as any).mockImplementationOnce(() => mockObserver);

      const diagrammer = new Diagrammer(context, config);
      diagrammer.destroy();

      expect(mockObserver.publish).toHaveBeenCalledWith(DestroyEventType.DESTROY);
      expect(destroy).toHaveBeenCalledWith(context);
    });
  });
});

import * as Preact from 'preact';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { getConnectedView } from 'diagrammer/components/view/ConnectedView';
import ConfigService from 'diagrammer/service/ConfigService';
import { DiagrammerData } from 'diagrammer/state/types';

export function render<NodeType, EdgeType>(
  store: Store<DiagrammerData<NodeType, EdgeType>>,
  container: HTMLElement,
  configService: ConfigService<NodeType, EdgeType>,
) {
  const ConnectedView = getConnectedView();
  return Preact.render(
    <Provider store={store}>
      <ConnectedView configService={configService} />
    </Provider>,
    container,
  );
}

export function destroy(container: HTMLElement) {
  return Preact.render(null, container);
}

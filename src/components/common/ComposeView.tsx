import * as Preact from 'preact';

import { BoundRenderCallback, DestroyCallback } from 'diagrammer/service/ConfigService';

export interface ComposeViewProps {
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
}

export default class ComposeView extends Preact.Component<ComposeViewProps> {
  private diagrammerContainer: HTMLElement | undefined | null;

  private consumerContainer: HTMLElement | undefined | void;

  public render() {
    return (
      <div
        className="dm-content"
        ref={(el) => { this.diagrammerContainer = el; }}
      />
    );
  }

  public componentDidMount = () => {
    this.rerenderConsumerNode();
  };

  public componentDidUpdate = () => {
    this.rerenderConsumerNode();
  };

  public componentWillUnmount = () => {
    // diagrammerContainer is always available because this is called after render
    this.props.destroyCallback(this.diagrammerContainer as HTMLElement, this.consumerContainer);
  };

  private rerenderConsumerNode = () => {
    // diagrammerContainer is always available because this is called after render
    this.consumerContainer = this.props.renderCallback(
      this.diagrammerContainer as HTMLElement,
      this.consumerContainer,
    );
  };
}

import React, { Component } from 'react';
import { DropTarget } from 'react-dnd'

const specification = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return false;
    }

    component.setState({
      isCurrentTarget: true
    })
  },
}

@DropTarget(props => props.accepts, specification, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  didDrop: monitor.didDrop(),
  item: monitor.getItem()
}))
class Drop extends Component {

  constructor(props) {
    super();
    this.state = {
      isCurrentTarget: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.didDrop && this.state.isCurrentTarget) {
      this.onDrop();
    }
  }

  onDrop() {
    this.props.onDrop(this.props.item);
    this.setState({ isCurrentTarget: false });
  }

  drop = () => (
    this.props.connectDropTarget(
      <div
        className={`${this.props.className} ${this.props.isOver ? 'is-over' : ''}`}
      >
        {this.props.children}
      </div>
    )
  )

  render() {

    return this.drop();
  }
}

export default Drop;
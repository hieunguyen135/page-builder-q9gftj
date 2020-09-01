import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const specification = {
  beginDrag(props) {
    document.getElementById('root').classList.toggle('is-dragging');

    return {
      name: props.type,
    }
  },
  endDrag() {
    document.getElementById('root').classList.toggle('is-dragging');
  }
}

@DragSource(props => props.type, specification, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class Block extends Component {

  block = () => {
    const { name, isDropped, isDragging, connectDragSource } = this.props

    return connectDragSource(
      <div className={`o-block ${isDragging === true ? 'is-dragging' : ''}`}></div>
    )
  }

  render() {

    return this.block();
  }
}

export default Block;
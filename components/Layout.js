import React, { Component } from 'react';
import Drop from './Drop.js';
import {
  MAX_COLUMN,
  ORIENTATION,
  POSITION,
  DRAG_AND_DROP_TYPE
} from '../constants.js';

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTopSectionDropZoneVisible: false,
      isBottomSectionDropZoneVisible: false
    }
  }

  getChildren = (orientation) => {
    return (this.isParent() && this.props.orientation === orientation) ? this.props.children : [];
  }

  onDrop = (position, item) => {
    this.props.onCreate(this.props.id, position, item);
    this.setState({isTopSectionDropZoneVisible: false});
    this.setState({isBottomSectionDropZoneVisible: false});
  }

  isParent = () => {
    return this.props.children && this.props.children.length > 0;
  }

  isRoot = () => {
    return this.props.isRoot;
  }

  layout = (props, index) => {
    return <Layout key={index} {...props} onDelete={this.props.onDelete} onCreate={this.props.onCreate} />
  }

  accepts = () => {
    return Object.values(DRAG_AND_DROP_TYPE);
  }

  isLast = () => {
    return this.props.children ? this.props.children[this.props.children.length - 1].id : undefined;
  }

  render() {
    return (
      <div
        className={`o-layout o-layout--parent ${this.isRoot() ? 'is-root' : ''}`}
      >
        {(this.isRoot()) && <Drop className={`o-layout__create--section-top ${this.state.isTopSectionDropZoneVisible ? 'is-over' : ''}`} accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.TOP, item)}><div onClick={() => this.setState({isTopSectionDropZoneVisible: true})}><strong>Drag and Drop</strong> your blocks here</div></Drop>}
        {(this.props.block) && <Drop className="o-layout__create--top" accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.TOP, item)}></Drop>}
        {(this.props.block) && <Drop className="o-layout__create--bottom" accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.BOTTOM, item)}></Drop>}
        {(this.isRoot()) && <Drop className="o-layout__create--right" accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.RIGHT, item)}></Drop>}
        {(this.isRoot()) && <Drop className="o-layout__create--left" accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.LEFT, item)}></Drop>}
        {(this.isParent() && !this.isRoot()) && <Drop className="o-layout__create--center" accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.CENTER, item)}></Drop>}

        {this.props.block && <div className="o-layout__block">{this.props.block}</div>}

        {this.props.block && <div className="o-layout__actions">
          <div className="o-layout__buttons">
            <button></button>
            <button onClick={() => this.props.onDelete(this.props)}></button>
          </div>
        </div>}

        {this.getChildren(ORIENTATION.COLUMN).length > 0 &&
          <div className="o-layout o-layout--children o-layout--horizontal">
            {this.getChildren(ORIENTATION.COLUMN).map((props, index) => this.layout(props, index))}
          </div>
        }

        {this.getChildren(ORIENTATION.ROW).length > 0 &&
          <div className="o-layout o-layout--children o-layout--vertical">
            {this.getChildren(ORIENTATION.ROW).map((props, index) => this.layout(props, index))}
          </div>
        }
        {(this.isRoot()) && <Drop className={`o-layout__create--section-bottom ${this.state.isBottomTopSectionDropZoneVisible ? 'is-over' : ''}`} accepts={this.accepts()} onDrop={(item) => this.onDrop(POSITION.BOTTOM, item)}><div><strong>Drag and Drop</strong> your blocks here</div></Drop>}
      </div>
    )
  }
}

export default Layout;
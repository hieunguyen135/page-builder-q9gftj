import React, { Component } from 'react';
import { render } from 'react-dom';
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Layout from './components/Layout.js';
import Block from './components/Block.js';
import Title from './components/Title.js';
import Description from './components/Description.js';
import Gallery from './components/Gallery.js';
import Spacer from './components/Spacer.js';
import {
  UTILITY,
  MAX_COLUMN,
  ORIENTATION,
  POSITION,
  DRAG_AND_DROP_TYPE
} from './constants.js';
import './index.css';
// import './debug.css';

const data = [
  {
    id: UTILITY.GENERATE_KEY(),
    orientation: ORIENTATION.ROW,
    isRoot: true,
    children: [
      {
        id: UTILITY.GENERATE_KEY(1),
        orientation: ORIENTATION.ROW,
        block: <Title text="Ouroboros" />
      },
      {
        id: UTILITY.GENERATE_KEY(2),
        orientation: ORIENTATION.ROW,
        block: <Description text="The ouroboros is an ancient symbol depicting a serpent or dragon eating its own tail. It symbolize the eternal return or cyclicality, in the sense of something constantly re-creating itself. It also represents the infinite cycle of nature's endless creation and destruction, life and death." />
      },
    ]
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data
    }
  }

  componentDidUpdate() {
    // console.log(this.state.data);
  }

  removeFromTree = (parent, childToRemove) => {
    parent.forEach(children => {
      if (children.id === childToRemove.id) {
        parent.splice(parent.indexOf(children), 1);
        return parent;
      }

      if (children.children && children.children.length > 0) {
        this.removeFromTree(children.children, childToRemove);
      }
    });

    return parent;
  }

  getBlock(item) {
    switch (item.name) {
      case DRAG_AND_DROP_TYPE.TITLE:
        return (<Title text="Ouroboros" />)
      case DRAG_AND_DROP_TYPE.DESCRIPTION:
        return (<Description text="The ouroboros is an ancient symbol depicting a serpent or dragon eating its own tail. It symbolize introspection, the eternal return or cyclicality, especially in the sense of something constantly re-creating itself. It also represents the infinite cycle of nature's endless creation and destruction, life and death." />)
      case DRAG_AND_DROP_TYPE.GALLERY:
        return (<Gallery />)
      case DRAG_AND_DROP_TYPE.SPACER:
        return (<Spacer />)
    }
  }

  addToTree = (parent, id, position, item) => {
    // TEMPLATE START
    const childElement = {
      id: UTILITY.GENERATE_KEY(3),
      orientation: ORIENTATION.ROW,
      block: this.getBlock(item)
    }

    const rootElement = {
      id: UTILITY.GENERATE_KEY(5),
      orientation: ORIENTATION.ROW,
      isRoot: true,
      children: [
        childElement
      ]
    }

    const columnElement1 = {
      id: UTILITY.GENERATE_KEY(7),
      orientation: ORIENTATION.ROW,
      children: [
        childElement
      ]
    }

    const columnElement2 = (child) => ({
      id: UTILITY.GENERATE_KEY(8),
      isRoot: true,
      orientation: ORIENTATION.COLUMN,
      children: [
        child,
        {
          id: UTILITY.GENERATE_KEY(9),
          orientation: ORIENTATION.ROW,
          children: [
            childElement
          ]
        }
      ]
    })
    
    const columnElement3 = (child) => ({
      id: UTILITY.GENERATE_KEY(10),
      isRoot: true,
      orientation: ORIENTATION.COLUMN,
      children: [
        {
          id: UTILITY.GENERATE_KEY(11),
          orientation: ORIENTATION.ROW,
          children: [
            childElement
          ]
        },
        child
      ]
    })
    // TEMPLATE END

    parent.some((child, index) => {
      if (child.id === id) {
        if (position === POSITION.TOP) {
          parent.splice(index, 0, child.isRoot ? rootElement : childElement);
        }

        if (position === POSITION.BOTTOM) {
          parent.push(child.isRoot ? rootElement : childElement);
        }

        if (position === POSITION.RIGHT) {
          if (child.orientation === ORIENTATION.COLUMN) {
            child.children.push(columnElement1);
          } else {
            if (child.isRoot) {
              delete child.isRoot;
            }

            parent.splice(index, 1, columnElement2(child))
          }
        }

        if (position === POSITION.LEFT) {
          if (child.orientation === ORIENTATION.COLUMN) {
            child.children.unshift(columnElement1);
          } else {
            if (child.isRoot) {
              delete child.isRoot;
            }

            parent.splice(index, 1, columnElement3(child))
          }
        }

        if (position === POSITION.CENTER) {
          parent.splice(index, 0, columnElement1);
        }

        return true;
      }

      if (child.children && child.children.length > 0) {
        this.addToTree(child.children, id, position, item);
      }
    });

    return parent;
  }

  removeEmptyFromTree = (parent) => {
    parent.forEach(children => {
      if (children.children && children.children.length === 0) {
        parent.splice(parent.indexOf(children), 1);
        return parent;
      }

      if (children.children && children.children.length > 0) {
        this.removeEmptyFromTree(children.children);
      }
    });

    return parent;
  }

  onHandleDelete = (child) => {
    this.setState({ data: this.removeFromTree([...this.state.data], child) });
    this.setState({ data: this.removeEmptyFromTree([...this.state.data]) });
  }

  onHandleCreate = (id, position, item) => {
    this.setState({ data: this.addToTree([...this.state.data], id, position, item) });
  }

  render() {
    return (
      <div>
        <div className="o-blocks">
          <ul>
            <li><Block type={DRAG_AND_DROP_TYPE.TITLE} /></li>
            <li><Block type={DRAG_AND_DROP_TYPE.DESCRIPTION} /></li>
            <li><Block type={DRAG_AND_DROP_TYPE.GALLERY} /></li>
            <li><Block type={DRAG_AND_DROP_TYPE.SPACER} /></li>
          </ul>
        </div>
        <div className="o-page-builder">
          <div className="o-page-builder__page">
            <div className="o-page-builder__body">
              {
                this.state.data.map((props, index) =>
                  <Layout
                    key={index}
                    {...props}
                    onDelete={(data) => this.onHandleDelete(data)}
                    onCreate={(id, position, item) => this.onHandleCreate(id, position, item)}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(
  <DragDropContextProvider backend={HTML5Backend}>
    <App />
  </DragDropContextProvider>,
  document.getElementById('root')
);

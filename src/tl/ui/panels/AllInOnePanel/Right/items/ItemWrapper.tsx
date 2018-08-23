import React from 'react'
import UIComponent from '$tl/ui/handy/UIComponent'
import css from './ItemWrapper.css'
import {resolveCss} from '$shared/utils'
import {PrimitivePropItem} from '$tl/ui/panels/AllInOnePanel/utils'
import DraggableArea from '$shared/components/DraggableArea/DraggableArea'

const classes = resolveCss(css)

interface IProps {
  item: PrimitivePropItem
}

interface IState {}

class ItemWrapper extends UIComponent<IProps, IState> {
  tempActionGroup = this.ui.actions.historic.temp()

  render() {
    const {height, top, expanded} = this.props.item
    return (
      <div
        {...classes('container')}
        onDoubleClick={this.toggleExpansion}
        style={{top, height}}
      >
        {this.props.children}
        {expanded && (
          <DraggableArea
            onDrag={this.handleResize}
            onDragEnd={this.handleResizeEnd}
            shouldReturnMovement={true}
          >
            <div {...classes('resizeHandle')} />
          </DraggableArea>
        )}
      </div>
    )
  }

  toggleExpansion = () => {
    this.ui.reduxStore.dispatch(
      this.ui.actions.historic.setPropExpansion({
        expanded: !this.props.item.expanded,
        ...this.props.item.address,
      }),
    )
  }

  handleResize = (_: number, dy: number) => {
    this.ui.reduxStore.dispatch(
      this.tempActionGroup.push(
        this.ui.actions.historic.setPropHeightWhenExpanded({
          ...this.props.item.address,
          height: this.props.item.height + dy,
        }),
      ),
    )
  }

  handleResizeEnd = () => {
    this.tempActionGroup.discard()
  }

  setExpansionHeight = (height: number) => {
    this.ui.reduxStore.dispatch(
      this.ui.actions.historic.setPropHeightWhenExpanded({
        ...this.props.item.address,
        height,
      }),
    )
  }
}

/*
const actionGroup = ui.actions.historic.temp()
ui.reduxStore.dispatch(actionGroup.push(ui.actions.historic.blah()))

ui.actions.historic.undo/redo() am has alan

*/

export default ItemWrapper

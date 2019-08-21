import React from 'react'
import {isMac} from '$shared/utils/isMac'

/**
 * @todo @easy Make this type more specific
 */
export type IActiveMode = undefined | null | string

interface IProps {
  modes: IMode[]
  /**
   * An escape hatch to get the current modes through an emitter.
   */
  __dontUseOrYoullBeFired_onChange?: (mode: IActiveMode) => void
}

interface IState {
  activeMode: IActiveMode
}

type IMode = 'option' | 'super' | 'shift' | 'd' | 'c' | 'h'

const KEYS_MAP: Record<IMode, KeyboardEvent['keyCode']> = {
  option: 18,
  shift: 16,
  // cmd vs ctrl
  super: isMac ? 91 : 17,
  d: 68,
  c: 67,
  h: 72,
}

export const MODES = Object.keys(KEYS_MAP).reduce((reducer, key) => {
  return {
    ...reducer,
    [key]: key.toUpperCase(),
  }
}, {}) as Record<IMode, string>

export const ActiveModeContext = React.createContext<IActiveMode>(null)

class ActiveModeProvider extends React.PureComponent<IProps, IState> {
  _isMouseDown: boolean
  _mapOfKeycodeToMode: Map<number, IMode>

  constructor(props: IProps) {
    super(props)

    this._mapOfKeycodeToMode = new Map(
      props.modes.map((mode): [number, IMode] => [KEYS_MAP[mode], mode]),
    )

    this.state = {
      activeMode: null,
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mouseenter', this.resetActiveMode)
    window.addEventListener('focus', this.resetActiveMode)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mouseenter', this.resetActiveMode)
    window.removeEventListener('focus', this.resetActiveMode)
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this._isMouseDown) return
    if (
      event.target &&
      (event.target as HTMLElement).tagName === 'INPUT' &&
      // cmd
      ![91].includes(event.keyCode)
    ) {
      return
    }

    const mode = this._mapOfKeycodeToMode.get(event.keyCode)
    if (mode != null) {
      this.setMode(MODES[mode])
      // this.setState(() => ({activeMode: MODES[mode]}))
    }
  }

  private handleKeyUp = () => {
    if (this.state.activeMode != null) {
      this.resetActiveMode()
    }
  }

  private handleMouseDown = () => {
    this._isMouseDown = true
  }

  private handleMouseUp = () => {
    this._isMouseDown = false
  }

  private resetActiveMode = () => {
    this.setMode(null)
  }

  setMode(activeMode: IActiveMode) {
    if (this.state.activeMode === activeMode) return
    this.setState(() => ({activeMode}))
    const fn = this.props.__dontUseOrYoullBeFired_onChange
    if (fn) {
      fn(activeMode)
    }
  }

  render() {
    return (
      <ActiveModeContext.Provider value={this.state.activeMode}>
        {this.props.children}
      </ActiveModeContext.Provider>
    )
  }
}

export default ActiveModeProvider

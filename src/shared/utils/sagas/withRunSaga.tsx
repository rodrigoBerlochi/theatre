import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
// import {HigherOrderComponent} from 'react-flow-types'
import {PropTypes} from 'prop-types'
import {call} from 'redux-saga/effects'
import {InferableComponentEnhancer} from 'react-redux'

function preventToThrow(fn: () => Generator_<$FixMe, $FixMe, $FixMe>) {
  return function* callAndCatch(
    ...args: $IntentionalAny[]
  ): Generator_<$FixMe, $FixMe, $FixMe> {
    try {
      return yield call(fn, ...args)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

// type FnSpread<T, R> = (...args: Array<T>) => Generator_<mixed,R,mixed>

type Fn0<R> = () => Generator_<mixed, R, mixed>
type Fn1<T1, R> = (t1: T1) => Generator_<mixed, R, mixed>
type Fn2<T1, T2, R> = (t1: T1, t2: T2) => Generator_<mixed, R, mixed>
type Fn3<T1, T2, T3, R> = (
  t1: T1,
  t2: T2,
  t3: T3,
) => Generator_<mixed, R, mixed>
type Fn4<T1, T2, T3, T4, R> = (
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
) => Generator_<mixed, R, mixed>
type Fn5<T1, T2, T3, T4, T5, R> = (
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5,
) => Generator_<mixed, R, mixed>
type Fn6<T1, T2, T3, T4, T5, T6, R> = (
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5,
  t6: T6,
) => Generator_<mixed, R, mixed>

export type RunSagaFn = (<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  R,
  Fn extends Fn6<T1, T2, T3, T4, T5, T6, R>
>(
  fn: Fn,
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5,
  t6: T6,
) => Promise<R>) &
  (<T1, T2, T3, T4, T5, R, Fn extends Fn5<T1, T2, T3, T4, T5, R>>(
    fn: Fn,
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4,
    t5: T5,
  ) => Promise<R>) &
  (<T1, T2, T3, T4, R, Fn extends Fn4<T1, T2, T3, T4, R>>(
    fn: Fn,
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4,
  ) => Promise<R>) &
  (<T1, T2, T3, R, Fn extends Fn3<T1, T2, T3, R>>(
    fn: Fn,
    t1: T1,
    t2: T2,
    t3: T3,
  ) => Promise<R>) &
  (<T1, T2, R, Fn extends Fn2<T1, T2, R>>(
    fn: Fn,
    t1: T1,
    t2: T2,
  ) => Promise<R>) &
  (<T1, R, Fn extends Fn1<T1, R>>(fn: Fn, t1: T1) => Promise<R>) &
  (<R, Fn extends Fn0<R>>(fn: Fn) => Promise<R>)
// @todo for some reason, including the FnSpread case causes flow to use it instead of FN0. So, no spread support for the time being
// & (<T, R, Fn: FnSpread<T, R>>(fn: Fn, ...args: Array<T>) => Promise<R>)

export type WithRunSagaProps = {runSaga: RunSagaFn}

export default function withRunSaga(): InferableComponentEnhancer<{
  runSaga: RunSagaFn
}> {
  return function connectedToSagas(component: any): any {
    const finalComponent = (
      props: Object,
      {store}: {store: {runSaga: Function}},
    ) => {
      const ownProps = {
        // @ts-ignore @ignore
        runSaga: (fn, ...args) =>
          // @ts-ignore @ignore
          store.sagaMiddleware.run(preventToThrow(fn), ...args).done,
      }
      return React.createElement(component, {...props, ...ownProps})
    }

    // @ts-ignore @ignore
    finalComponent.contextTypes = {
      store: PropTypes.any,
    }

    // @ts-ignore @ignore
    finalComponent.displayName = `withRunSaga(${component.displayName ||
      component.name ||
      'Component'})`

    hoistNonReactStatics(finalComponent, component)

    return finalComponent
  }
}

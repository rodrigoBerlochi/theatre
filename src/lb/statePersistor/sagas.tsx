import {app} from 'electron'
import path from 'path'
import {call, put, fork, select, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import fse from 'fs-extra'
import deepEqual from 'deep-equal'
import {bootstrapAction, setStateAction} from '$lb/common/actions'
import pickPathsFromObject from 'lodash/pick'
import spreadPaths from '$src/shared/utils/spreadPaths'

export const pathToPersistenceFile =
  process.env.NODE_ENV === 'test'
    ? '/foo/state.json'
    : path.join(app.getPath('userData'), 'state.json')

export const whitelistOfPartsOfStateToPersist = [['projects', 'listOfPaths']]

export default function* statePersistorRootSaga(): Generator_<
  $FixMe,
  $FixMe,
  $FixMe
> {
  yield call(_loadState)
  yield fork(persistStateChanges)
  yield null
}

export function* _loadState(): Generator_<$FixMe, $FixMe, $FixMe> {
  // return yield put(bootstrapAction())

  const fileExists: boolean = yield call(fse.pathExists, pathToPersistenceFile)
  if (!fileExists) return yield put(bootstrapAction())

  const content = yield call(fse.readFile, pathToPersistenceFile, {
    encoding: 'utf-8',
  })

  let jsonData
  try {
    jsonData = JSON.parse(content)
  } catch (e) {
    console.error(
      `could not parse json content in state file '${pathToPersistenceFile}'`,
    )
    return yield put(bootstrapAction())
    // @todo report this
  }

  const oldState = yield select()
  const newState = spreadPaths(
    whitelistOfPartsOfStateToPersist,
    jsonData,
    oldState,
  )

  yield put(setStateAction(newState))
  return yield put(bootstrapAction())
}

function* persistStateChanges(): Generator_<$FixMe, $FixMe, $FixMe> {
  let lastState = pickPathsFromObject(
    yield select(),
    // @ts-ignore @todo
    whitelistOfPartsOfStateToPersist,
  )
  yield takeLatest('*', function*(): Generator_<$FixMe, $FixMe, $FixMe> {
    yield delay(2)
    const newState = pickPathsFromObject(
      yield select(),
      // @ts-ignore @todo
      whitelistOfPartsOfStateToPersist,
    )
    if (!deepEqual(lastState, newState)) {
      yield call(persistNewState, newState)
      lastState = newState
    }
  })
}

function* persistNewState(newState: {}): Generator_<$FixMe, $FixMe, $FixMe> {
  yield call(fse.ensureFile, pathToPersistenceFile)
  const stringified = JSON.stringify(newState)
  yield call(fse.writeFile, pathToPersistenceFile, stringified, {
    encoding: 'utf-8',
  })
}

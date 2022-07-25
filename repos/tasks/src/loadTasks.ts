import { isObj, isFunc } from '@keg-hub/jsutils'
import { getStore, actionTypes } from '@TSKStore'
import { configContext } from '@TSKShared/contexts/configContext'
import * as dockerTasks from '@TSKDocker'
import * as devspaceTasks from '@TSKDevspace'
import {
  TTask,
  TTasks,
  TTaskArgs,
  TaskConfig,
  TTaskAction,
  TInTaskConfig,
} from '@TSKShared/shared.types'

const docTasks = dockerTasks as unknown as TTasks
const devTasks = devspaceTasks as unknown as TTasks

const dispatchConfig = (config:TaskConfig) => {
  getStore().dispatch({
    type: actionTypes.SET_CONFIG,
    payload: config
  })
}

const injectConfig = (taskAction:TTaskAction, config:TaskConfig) => {
  return (args:TTaskArgs) =>
    taskAction({
      ...args,
      config: config,
    })
}

export const initialize = (tasks:TTasks, config:TaskConfig) => {
  Object.entries(tasks)
    .map(([ key, task ]:[string, TTask]) => {
      isFunc(task.action)
        && (task.action = injectConfig(task.action, config))

      isObj(task.tasks)
        && (task.tasks = initialize(task.tasks, config))
    })

  return tasks
}

export const loadTasks = (inConfig:TInTaskConfig):TTasks => {
  const config = configContext(inConfig)
  dispatchConfig(config)

  return {
    ...initialize(docTasks, config),
    ...initialize(devTasks, config)
  }
}

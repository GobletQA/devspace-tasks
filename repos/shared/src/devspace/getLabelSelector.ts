import { resolveContext } from '../contexts/resolveContext'
import { TaskConfig, TTaskParams } from '../shared.types'

/**
 * Gets the label used to select the a specific container relative to an application
 * @param {Object} params - task action params derived from the passed in options
 *
 * @return {Object} - Found label selector and devspace selector args used to select a container
 */
export const getLabelSelector = (params:TTaskParams, config:TaskConfig) => {
  const { context, env } = params
  // TODO: make a selector for pods
  const selector = resolveContext(context, config?.selectors?.pods)

  return {
    selector,
    args: [`--label-selector`, selector],
  }
}


import { noOpObj, noPropArr, exists }  from '@keg-hub/jsutils'

/**
 * Extracts the args for the devspace command from the params object
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Array} - Argument array with the devspace options added
 */
export const getCmdOptions = (
  params:Record<any, any> = noOpObj,
  flags:Record<any, any> = noOpObj,
  values:string[]=noPropArr
):string[] => {
  return Object.entries(params)
    .reduce((options, [key, value]:[string, any]) => {
      if (flags[key] && value) options.push(flags[key])
      else if (values.includes(key) && exists(value)) options.push(`--${key}`, value)

      return options
    }, [])
}


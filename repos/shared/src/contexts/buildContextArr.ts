
/**
 * Ensures the passed in context is a cleaned array
 */
export const buildContextArr = (context:string|string[], fallback?:string):string[] => {
  const arr = Array.isArray(context)
    ? context
    : context.split(`,`)

  fallback && arr.push(fallback)

  return arr.map(ctx => ctx.trim())
}
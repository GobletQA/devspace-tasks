/**
 * Used by devspace in the devspace.yml to dynamically open the frontend url
 * Ensures it only opens the url when the frontend is deployed
 */
 
/**
 * Check if the frontend is being deploy
 * If it is, build the url to be opened
 */
const [feActive, fePort] = process.argv.slice(2)
process.stdout.write(Boolean(process.env[feActive]) ? `  - url: http://localhost:${fePort}` : ``)

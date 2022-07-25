/**
 * TODO: update this to work in a more dynamic context based on defined config
 */

/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 */

const sharedIgnored = `
  - node_modules/
  - __tests__/
  - __mocks__/
`

const syncFrontendConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /app
  uploadExcludePaths:
  ${sharedIgnored}
`)

const syncBackendConfig = (deployment, extraIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /app
  uploadExcludePaths:
  ${sharedIgnored}
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (isActiveEnv, backend) => {
  const deployment = process.env[isActiveEnv]
  return Boolean(deployment)
    ? backend
      ? syncBackendConfig(deployment)
      : syncFrontendConfig(deployment)
    : ``
}

const args = process.argv.slice(2)
const beDeployment = generateSync(args.shift(), true)
const feDeployment = generateSync(args.shift())

let syncs = ``
beDeployment && (syncs += beDeployment)
feDeployment && (syncs += feDeployment)

process.stdout.write(syncs)

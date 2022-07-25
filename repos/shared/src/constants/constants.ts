const KUBE_COMPONENT_LABEL=`app.kubernetes.io/component`
const REPO_LOC_KEYS = [`valuesFile`, `dockerFile`, `configsDir`, `devspaceDir`]
const REPO_LOC_FILE_MAP = {
  configsDir: `config.`,
  valuesFile: `values.`,
  devspaceDir: `devspace.`,
  dockerFile: `Dockerfile`,
}
const ROOT_DIR_FILE_MAP = {
  valuesDir: `values.`,
  configsDir: `config.`,
  devspaceDir: `devspace.`,
  dockerFilesDir: `Dockerfile`,
}

export {
  REPO_LOC_KEYS,
  REPO_LOC_FILE_MAP,
  ROOT_DIR_FILE_MAP,
  KUBE_COMPONENT_LABEL,
}
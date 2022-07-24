const docker = {
  name: 'docker',
  alias: ['doc', 'dc'],
  tasks: {
    ...require('./build'),
    ...require('./login'),
    ...require('./run'),
  },
}

module.exports = {
  docker
}
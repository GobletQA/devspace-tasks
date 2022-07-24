import { build } from './build'
import { login } from './login'
import { run } from './run'

export const docker = {
  name: 'docker',
  alias: ['doc', 'dc'],
  tasks: {
    build,
    login,
    run
  },
}

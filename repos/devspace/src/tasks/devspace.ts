import { cmd } from './cmd'
import { start } from './start'

const devspace = {
  name: 'devspace',
  alias: ['ds', 'dev'],
  tasks: {
    cmd,
    start,
    ...require('./attach'),
    ...require('./build'),
    ...require('./clean'),
    ...require('./deploy'),
    ...require('./log'),
    ...require('./run'),
    ...require('./status'),
    ...require('./sync'),
  },
}

export {
  devspace
}
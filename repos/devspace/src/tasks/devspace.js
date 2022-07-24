import { start } from 'start'

const devspace = {
  name: 'devspace',
  alias: ['ds', 'dev'],
  tasks: {
    start,
    ...require('./attach'),
    ...require('./build'),
    ...require('./clean'),
    ...require('./cmd'),
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
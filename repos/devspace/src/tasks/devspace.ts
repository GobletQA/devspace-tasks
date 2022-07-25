import { attach } from './attach'
import { build } from './build'
import { clean } from './clean'
import { deploy } from './deploy'
import { log } from './log'
import { run } from './run'
import { status } from './status'
import { sync } from './sync'
import { cmd } from './cmd'
import { start } from './start'

export const devspace = {
  name: 'devspace',
  alias: ['ds', 'dev'],
  tasks: {
    cmd,
    log,
    run,
    sync,
    start,
    build,
    clean,
    attach,
    deploy,
    status,
  },
}

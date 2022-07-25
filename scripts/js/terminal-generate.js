/**
 * Generates terminals for the root directory, and all
 * directories inside of `repos` with vscode
 * 
 * This writes a file to .vscode/tasks.json which contains
 * the necessary config to launch a separate terminal
 * for each repo. 
 * 
 * By default, the config will launch when opening
 * this folder. It can be manually executed by 
 * running the VS Code Tasks command
 * 
 * Shortcut on Mac: ⇧⌘B (Command + Shift + B)
 * 
 * Source: https://code.visualstudio.com/docs/editor/integrated-terminal#_automating-launching-of-terminals
 */

const { readdirSync, readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } = require('fs')
const { deepMerge, flatUnion } = require('@keg-hub/jsutils')

const timestamp = Date.now();
const reposFolder = "repos";
const vsCodeFolder = ".vscode";
const tasksFile = "tasks.json";
const tasksBackupFile = `tasks.backup-${timestamp}.json`;
const writeLocation = `${vsCodeFolder}/${tasksFile}`;
const defaultShell = "/bin/zsh";
const terminalTaskLabel = "Create terminals"

/**
 * Gets the current sub-directories form the passed in source folder
 * @function
 * @param {string} source - Location to look for sub-directories
 *
 * @return {Array<string>} - Names of all found sub-directories
 */
const getDirectories = source => {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

/**
 * Writes passed in contend to the path of the passed in location
 * @function
 * @param {string} location - File location where the content should be saved
 * @param {OBject} content - JS Object content to write to the file as a json string
 *
 * @return {boolean} - True if the file content was written to the file
 */
const writeTasksFile = (location, content) => {
  try {
    if (!existsSync(vsCodeFolder)) {
      mkdirSync(vsCodeFolder);
    }

    writeFileSync(location, JSON.stringify(content, null, 2));
    console.log(`File written to ${location} successfully`);
    return true;

  } catch (err) {
    console.error(`Error writing to ${location}:`, err);
    return false;
  }
}

/**
 * Generate config.tasks array from the current sub-directories
 * @function
 * @param {Object} config - VScode Config object
 *
 * @return {Object} - VScode Config object with the tasks array updated based on current sub-directories
 */
const addSubDirsToConfig = config => {
  const directories = getDirectories(reposFolder);
  directories.forEach(dir => {
    config.tasks[0].dependsOn.push(dir);

    config.tasks.push({
      type: "process",
      label: dir,
      command: defaultShell,
      options: {
        cwd: `${reposFolder}/${dir}`,
      },
      problemMatcher: [],
      isBackground: true,
    });
  })

  return config
}

/**
 * Builds the default VScode Config object with the tasks for the current sub-directories
 * @function
 * @return {Object} - VScode Config object
 */
const buildTasksConfig = () => {
  // base config
  const config = {
    version: "2.0.0",
    presentation: {
      echo: false,
      reveal: "always",
      focus: false,
      panel: "dedicated",
      showReuseMessage: true
    },
    tasks: [
      {
        // base config
        label: terminalTaskLabel,
        dependsOn: [
          "strategy-application",
        ],
        // Mark as the default build task so cmd/ctrl+shift+b will create them
        group: {
          kind: "build",
          isDefault: true
        },
        // Try start the task on folder open
        runOptions: {
          runOn: "folderOpen"
        }
      },
      {
        // root dir
        type: "process",
        label: "strategy-application",
        command: defaultShell,
        options: {},
        problemMatcher: [],
        isBackground: true,
      }
    ]
  }

  return addSubDirsToConfig(config)
}

;(() => {

  /**
   * Get the default config object
   */
  const config = buildTasksConfig()

  /**
   * Validates there are repos write for the tasks file
   */
  if (config.tasks.length <= 2) {
    console.error(`Not enough repos found to write to the ${tasksFile} file`);
    process.exit(1)
  }

  /**
   * Write new file -- or create backup and merge old with new
   */
  if (!existsSync(writeLocation)) {
    writeTasksFile(writeLocation, config);
  } else {
    try {

      const currentConfigStr = readFileSync(writeLocation);

      if (currentConfigStr) {
        const currentConfig = JSON.parse(currentConfigStr);

        console.log(`Found an existing ${tasksFile}. Creating backup at ${tasksBackupFile}`);
        copyFileSync(writeLocation, `${vsCodeFolder}/${tasksBackupFile}`);
      
        console.log(`Deep merging old and new ${tasksFile}`);
        const mergedConfig = deepMerge(currentConfig, config);
        mergedConfig.tasks = flatUnion(config.tasks, currentConfig.tasks, item => item.label)

        console.log(`Writing ${writeLocation}`);
        writeTasksFile(writeLocation, mergedConfig);
      }
    } catch (err) {
      console.error('\nError creating backup and merging\n', err.stack)
      process.exit(1)
    }
  }

  console.log('\nSuccess! Use ⇧⌘B (Command + Shift + B) on a Mac to run the task\n');
})()

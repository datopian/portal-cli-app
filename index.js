#!/usr/bin/env node
const Listr = require('listr')
const { program } = require('commander')
const chalk = require('chalk')
const path = require('path')
const figlet = require('figlet')
const package = require('./package.json')
const { directoryExists, execShellCommand, processArgs } = require('./utils')
console.log(
  chalk.yellow(figlet.textSync('Portal App', { horizontalLayout: 'full' }))
)

// Commander parameters to specify CLI behavior
program
  .version(package.version)
  .usage('show [ path=/some/path | npm=true | port=3000 ]')
  .description('Creates a portal application from specified dataset')
  .option('show', 'Displays the dataset in specified port')
  .option('npm', '[true || false] Install dependencies using npm instead yarn, defaults to false (yarn)')
  .option('port', 'Server port, defaults to 3000')
  .parse(process.argv,)

const userArgs = processArgs(program.args)


/**
 * Main method to start CLI and validate inputs
 */
async function run() {
  if (!userArgs.show) {
    console.log(
      `${chalk.yellow(`Specify a command to run! Run ${chalk.cyan("portal -h")} for help`)}`
    )
    process.exit(1)
  }

  const datasetPath = userArgs.path.trim()

  if (directoryExists(datasetPath)) {
    console.log(
      `${chalk.yellow(`Using dataset found in: ${chalk.cyan(datasetPath)}`)}`
    )
  } else {
    console.log(
      `${chalk.red(`Directory: ${chalk.cyan(datasetPath)} does not exist!`)}`
    )
    process.exit(1)
  }

  console.log(datasetPath);
  const portalGithubRepo = "https://github.com/datopian/portal.js.git"
  const portalLocalRepoDirectory = path.join(datasetPath, "portal.js")

  const cloneRepoCmd = `cd ${datasetPath} && git clone ${portalGithubRepo}`

  const buildNextAppCmd = userArgs.npm ? `cd ${portalLocalRepoDirectory} && export PORTAL_DATASET_PATH=${datasetPath} && npm install && npm run build` :
    `cd ${portalLocalRepoDirectory} && export PORTAL_DATASET_PATH=${datasetPath} && yarn && yarn build`

  const startNextAppCmd = userArgs.npm ?
    ` cd ${portalLocalRepoDirectory} && npm run start -p ${userArgs.port}` :
    `cd ${portalLocalRepoDirectory} && yarn start -p ${userArgs.port}`


  //Tasks workflow
  const tasks = new Listr([
    {
      title: 'Getting portal tools...',
      task: async () => {
        try {
          if (directoryExists(portalLocalRepoDirectory)) {
            console.log(
              chalk.cyan(`${package.name} ${chalk.yellow('already exists! Skipping this step')}`))
          } else {
            await execShellCommand(cloneRepoCmd)
          }

        } catch (error) {
          throw error
        }
      },
    },
    {
      title: 'Preparing your app...',
      task: async () => { await execShellCommand(buildNextAppCmd) }
    },
    {
      title: `Displaying dataset at http://localhost:${userArgs.port}`,
      task: () => execShellCommand(startNextAppCmd),
    }
  ])

  tasks.run()
}

run().catch((error) => {
  console.log(error)
  console.log()
  process.exit(1)
})
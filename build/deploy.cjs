/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const { NodeSSH } = require('node-ssh')
const home = require("home");
/* eslint-enable @typescript-eslint/no-var-requires */

const {
  DEPLOY_PATH,
  DEPLOY_SSH_HOST,
  DEPLOY_SSH_PORT,
  DEPLOY_SSH_USERNAME,
} = process.env

if (!DEPLOY_PATH) {
  throw new Error('DEPLOY_PATH is not configured')
}
if (!DEPLOY_SSH_HOST) {
  throw new Error('DEPLOY_SSH_HOST is not configured')
}
if (!DEPLOY_SSH_PORT) {
  throw new Error('DEPLOY_SSH_PORT is not configured')
}
if (!DEPLOY_SSH_USERNAME) {
  throw new Error('DEPLOY_SSH_USERNAME is not configured')
}


const ssh = new NodeSSH()
const join = (relativePath) => path.join(__dirname, '..', relativePath)

const putDirectory = async (fromDirectory, toDirectory) => {
  await ssh
    .putDirectory(fromDirectory, toDirectory, {
      recursive: true,
      concurrency: 10,
      validate(itemPath) {
        const baseName = path.basename(itemPath)
        return baseName !== 'node_modules'
      }
    })
    .then((status) => {
      // eslint-disable-next-line no-console
      console.log(`transfer was ${
        status ? 'successful' : 'unsuccessful'
      }: [${fromDirectory} => ${toDirectory}]`)
    })
}

async function restart() {
  await ssh.connect({
    host: DEPLOY_SSH_HOST,
    port: Number(DEPLOY_SSH_PORT),
    username: DEPLOY_SSH_USERNAME,
    // 私钥路径（不使用私钥的话，把下面这行换成`password`字段，填SSH登录密码）
    privateKeyPath: path.join(home.resolve("~"), ".ssh/id_rsa"),
  });

  await putDirectory(join('/.output'), DEPLOY_PATH)

  const singleFileList = [
    '/README.md',
  ].map((fileName) => ({
    local: join(fileName),
    remote: `${DEPLOY_PATH}/${fileName}`,
  }))

  singleFileList.push({
    local: join('/.npmrc'),
    remote: `${DEPLOY_PATH}/server/.npmrc`,
  })

  await ssh.putFiles(singleFileList).then(
    () => {
      // eslint-disable-next-line no-console
      console.log('The File thing is done')
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log("Something's wrong")
      // eslint-disable-next-line no-console
      console.log(error)
    },
  )

  const execCommand = [
    'pwd',
    'ls',
    'nvm --version',
    // 'export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node',
    // 'nvm install v18.18.0',
    'nvm use v16.14.2',
    'node --version',
    'cd ./server',
    // 'npm install --save-exact --registry https://registry.npmmirror.com',
    // 'npm install mysql2@3.6.5 --save-exact --registry https://registry.npmmirror.com',
    // 'pm2 start ./index.mjs --name IdeaPress',
    'pm2 restart IdeaPress',
  ].join(' && ')
  await ssh.execCommand(execCommand, {
    cwd: DEPLOY_PATH,
    onStdout(chunk) {
      // eslint-disable-next-line no-console
      console.log('onStdout')
      // eslint-disable-next-line no-console
      console.log(chunk.toString('utf8'))
    },
    onStderr(chunk) {
      // eslint-disable-next-line no-console
      console.log('onStderr')
      // eslint-disable-next-line no-console
      console.log(chunk.toString('utf8'))
      throw new Error('failed')
    },
  })
  // eslint-disable-next-line no-console
  console.log('发布结束')
  process.exit(0)
}

const pathPackageJSON = path.join(__dirname, '../.output/server/package.json')
const outputPackageJSON = fs.readFileSync(pathPackageJSON)
const json = JSON.parse(outputPackageJSON)
// 换成ESM模块
json.dependencies['@popperjs/core'] = 'npm:@sxzz/popperjs-es@^2.11.7'
fs.writeFileSync(pathPackageJSON, JSON.stringify(json))

restart().catch((err) => {
  setTimeout(() => {
    throw err
  }, 0)
})

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distRoot = join(projectRoot, 'dist')
const routes = ['feed', 'news', 'friends', 'games', 'shop', 'search', 'assistant', 'profile']
const gameRoutes = ['snack-sort', 'spot-the-slop', 'cozy-robot', 'mood-cloud', 'path-pebble']

const indexHtml = await readFile(join(distRoot, 'app', 'index.html'), 'utf8')
const nestedIndexHtml = indexHtml
  .replaceAll('href="../assets/', 'href="../../assets/')
  .replaceAll('src="../assets/', 'src="../../assets/')
  .replaceAll('href="../favicon.svg"', 'href="../../favicon.svg"')

const gameIndexHtml = indexHtml
  .replaceAll('href="../assets/', 'href="../../../assets/')
  .replaceAll('src="../assets/', 'src="../../../assets/')
  .replaceAll('href="../favicon.svg"', 'href="../../../favicon.svg"')

await Promise.all(routes.map(async (route) => {
  const routeDir = join(distRoot, 'app', route)
  await mkdir(routeDir, { recursive: true })
  await writeFile(join(routeDir, 'index.html'), nestedIndexHtml)
}))

await Promise.all(gameRoutes.map(async (route) => {
  const routeDir = join(distRoot, 'app', 'games', route)
  await mkdir(routeDir, { recursive: true })
  await writeFile(join(routeDir, 'index.html'), gameIndexHtml)
}))

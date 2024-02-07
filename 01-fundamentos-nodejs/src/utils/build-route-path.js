export function buildRoutePath(path) {
  const routeParamatersRegex = /:([a-zA-z]+)/g
  console.log(Array.from(path.matchAll(routeParamatersRegex)))
}
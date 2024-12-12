interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceInKilometersBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  const R = 6371
  const latFrom = (from.latitude * Math.PI) / 180
  const latTo = (to.latitude * Math.PI) / 180
  const latDif = ((latTo - latFrom) * Math.PI) / 180

  const longDif = ((to.longitude - from.longitude) * Math.PI) / 180

  const a =
    Math.sin(latDif / 2) * Math.sin(latDif / 2) +
    Math.cos(latFrom) *
      Math.cos(latTo) *
      Math.sin(longDif / 2) *
      Math.sin(longDif / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const dist = R * c

  return dist
}

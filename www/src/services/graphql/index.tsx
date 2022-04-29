
const listCropSpeciesDocument = `
    query listCropSpecies {
  listCropSpecies {
    _id
    importId
    name
    lowTemp
    highTemp
    sewingMethods
    otherNames
    harvestDayMin
    harvestDayMax
    maxSpacingInCM
    minSpacingInCM
  }
}
`;
const listGeoLocations = `
query listGeoLocation($input: GeoLocationFilterInput!){
  listGeoLocation(input:$input) {
    _id
    city
    country
    location
    nearestMatch{
      _id
      city
    }
}
}`
export { listGeoLocations, listCropSpeciesDocument }
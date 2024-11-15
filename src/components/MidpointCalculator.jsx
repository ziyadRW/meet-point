function MidpointCalculator(locations) {
    const latitudes = locations.map((location) => location.lat);
    const longitudes = locations.map((location) => location.lng);
  
    const midpointLat = latitudes.reduce((sum, lat) => sum + lat, 0) / locations.length;
    const midpointLng = longitudes.reduce((sum, lng) => sum + lng, 0) / locations.length;
  
    return { lat: midpointLat, lng: midpointLng };
  }
  
  export default MidpointCalculator;
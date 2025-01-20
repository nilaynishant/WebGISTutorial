// Function to handle GetFeatureInfo setup
function setupGetFeatureInfo(map, wmsLayer) {
    map.on('click', function (e) {
      var url = getFeatureInfoUrl(map, wmsLayer, e.latlng);
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          var featureInfo = parseFeatureInfo(data.features[0].properties);
          $('#feature-info').html(featureInfo);
        },
        error: function (xhr, status, error) {
          console.error('Error fetching feature info:', error);
          $('#feature-info').html('<p>Error fetching feature information.</p>');
        }
      });
    });
  }
  
  // Function to construct the GetFeatureInfo URL
  function getFeatureInfoUrl(map, wmsLayer, latlng) {
    var point = map.latLngToContainerPoint(latlng, map.getZoom());
    var size = map.getSize();
    var params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: 'EPSG:4326',
      styles: '',
      transparent: true,
      version: wmsLayer.wmsParams.version,
      format: 'image/png',
      bbox: map.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: wmsLayer.wmsParams.layers,
      query_layers: wmsLayer.wmsParams.layers,
      info_format: 'application/json'
    };
    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
    return wmsLayer._url + L.Util.getParamString(params, wmsLayer._url, true);
  }
  
  // Function to parse the GetFeatureInfo response
  function parseFeatureInfo(data) {
    var content = '<h3>Feature Information:</h3>';
    for (var prop in data) {
      content += '<p><strong>' + prop + ':</strong> ' + data[prop] + '</p>';
    }
    return content;
  }
  
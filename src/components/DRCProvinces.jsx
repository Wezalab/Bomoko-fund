import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

const geoUrl = '../constants/countryData.json';

// interface Province {
//   id: string;
//   name: string;
// }


const DRCProvinces=()=>{
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [geographies, setGeographies] = useState([]);

    useEffect(() => {
        fetch(geoUrl)
        .then((response) => response.json())
        .then((data) => setGeographies(data.features))
        .catch((error) => console.error('Error loading GeoJSON:', error));
    }, []);

    const handleProvinceClick = (geo) => {
        const { id } = geo;
        const name = geo.properties.name;
        setSelectedProvince({ id, name });
    };

  return (
    <div>
        
      <ComposableMap projection="geoMercator">
        <Geographies geography={geographies}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleProvinceClick(geo)}
                style={{
                  default: {
                    fill: selectedProvince?.id === geo.id ? '#FF5722' : '#ECEFF1',
                    outline: 'none',
                  },
                  hover: {
                    fill: '#FF5722',
                    outline: 'none',
                  },
                  pressed: {
                    fill: '#FF5722',
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      {selectedProvince && (
        <div>
          <h3>Selected Province:</h3>
          <p>{selectedProvince.name}</p>
        </div>
      )}
    </div>
  )
}

export default DRCProvinces
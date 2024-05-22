import React from "react";

function LocationList(props) {
  const detail = props.locationDetails;
  return (
    <li key={detail.Location} className="App__location-container-content">
      <div>{detail["Location Detail"]} </div>
      <div>Location code: {detail.Location}</div>
      <div>
        Current Temp: {detail.CurrentTemp}
        °C
      </div>
    </li>
  );
}

export default LocationList;

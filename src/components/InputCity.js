import { Container } from "@mui/material";
import { useContext, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { GeoContext } from "../context/GeoContext";

export default function InputCity() {
  const [query, setQuery] = useState("");
  const [data, setdata] = useState([]);
  const [setgeo] = useContext(GeoContext);
  const autogeo = useGeolocation();
  const handleLiClick = (item) => {
    localStorage.setItem("lat", item.lat);
    localStorage.setItem("lon", item.lon);
    localStorage.setItem("methode", "manual");
    setgeo({ latitude: item.lat, longitude: item.lon, accuracy: "" });
  };
  const autoButtonHandler = () => {
    localStorage.setItem("lat", "");
    localStorage.setItem("lon", "");
    localStorage.setItem("methode", "auto");
    setgeo(autogeo);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon_geojson=1&addressdetails=1}`
    )
      .then((res) => res.json())
      .then((result) => {
        setQuery("");
        setdata(result);
      });
  };
  const search = (evt) => {
    if (evt.key === "Enter") {
      onSubmitHandler();
    }
  };
  return (
    <Container>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="name">City name</label>
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
          type="text"
          id="name"
        />
        <button>Search</button>
        <button onClick={autoButtonHandler}>Auto</button>
      </form>

      <ul className="mat_list">
        {data.map((item) => {
          return (
            <li onClick={() => handleLiClick(item)} key={item.place_id}>
              {item.display_name}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

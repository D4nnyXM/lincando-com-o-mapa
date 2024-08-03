import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Corrige o problema com os ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    async function fetchISSLocation() {
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        const { latitude, longitude } = data.iss_position;

        setLocation({ latitude, longitude });
      } catch (error) {
        console.error('Error fetching ISS location:', error);
      }
    }

    fetchISSLocation();
    const interval = setInterval(fetchISSLocation, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  return (
    <div className="App">
      <MapContainer center={[location.latitude, location.longitude]} zoom={2} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            ISS is here! <br /> Latitude: {location.latitude}, Longitude: {location.longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;

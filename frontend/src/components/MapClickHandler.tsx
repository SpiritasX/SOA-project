import { useMapEvents } from "react-leaflet";

export default function MapClickHandler(props: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      props.onClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
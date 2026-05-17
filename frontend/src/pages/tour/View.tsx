import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTour } from "../../api/tour";



type Tour = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  price: number;
  difficulty: string;
  status: string;
  authorId: number;
  firstTourLocationId: number;
};

function View() {
  const { id } = useParams();

  const [tour, setTour] = useState<Tour | null>(null);

  const [error, setError] = useState("");

  const fetchTour = async () => {
    try {
      const res = await getTour(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();
      setTour(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTour();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>

      <hr />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default View;
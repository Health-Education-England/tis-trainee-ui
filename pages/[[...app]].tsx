import { useState, useEffect } from "react";
import CRAEntryPoint from "../components/app/CRAEntryPoint";

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CRAEntryPoint />;
}

export default App;

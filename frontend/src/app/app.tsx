import { careerClient, type CareerClient } from "@/entities/career";
import { CareerPage } from "@/pages/career";

interface AppProps {
  client?: CareerClient;
}

export default function App({ client = careerClient }: AppProps) {
  return <CareerPage client={client} />;
}

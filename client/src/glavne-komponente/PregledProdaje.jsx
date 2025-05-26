import { useState } from "react";
import { useLanguage } from "../kontekst/LanguageContext";

const PregledProdaje = () => {
  const [datum, setDatum] = useState({ od: "", do: "" });
  const { t } = useLanguage();

  const izmjenaDatuma = (e) => {
    const { name, value } = e.target;
    setDatum((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatistika = async (e) => {
    e.preventDefault();
    console.log(datum);
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="text-center mt-10 text-4xl font-semibold">Pregled prodaje</h1>
      <form onSubmit={handleStatistika} className="prodaja-datumi">
        <div className="">
          <label>{t("flights.departureTimeFrom")}:</label>
          <input type="date" name="od" value={datum.od} onChange={izmjenaDatuma} className="input-field" />
        </div>
        <div className="">
          <label>{t("flights.departureTimeTo")}:</label>
          <input type="date" name="do" value={datum.do} onChange={izmjenaDatuma} className="input-field" />
        </div>
        <button type="submit" className="navigacija-dugme">
          Prikaži stanje prodaje
        </button>
      </form>
    </div>
  );
};

export default PregledProdaje;

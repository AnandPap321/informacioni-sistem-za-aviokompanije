import { useState, useRef } from "react";
import { api } from "../api/axiosInstance";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Label } from "recharts";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";
import { getISOWeeksInYear } from "date-fns";

const PregledProdaje = () => {
  const [data, setData] = useState(null);
  const trenutnaGodina = new Date().getFullYear();
  const [godina, setGodina] = useState(trenutnaGodina);
  const [sedmicaOd, setSedmicaOd] = useState(1);
  const [sedmicaDo, setSedmicaDo] = useState(1);
  const [sedmicaUGodini, setSedmicaUGodini] = useState(getISOWeeksInYear(new Date(godina, 0, 1)));

  useEffect(() => {
    const sedmica = getISOWeeksInYear(new Date(godina, 0, 1));
    setSedmicaUGodini(sedmica);
    setSedmicaOd(20);
    setSedmicaDo(23);
  }, [godina]);

  const handlePregledProdaje = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/admin/pregled-prodaje`, {
        params: { godina: godina, sedmicaOd: sedmicaOd, sedmicaDo: sedmicaDo },
      });
      setData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pdfRef = useRef();

  const formatDatumaZaEU = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}.`;
  };

  const downloadPDF = () => {
    const element = pdfRef.current.cloneNode(true);

    const container = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = `Izvještaj o prihodima na datum: ${formatDatumaZaEU(new Date())}`;
    title.style.textAlign = "center";

    container.appendChild(title);
    container.appendChild(element);

    const opt = {
      margin: 0.5,
      filename: "dokument.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(container).save();
  };

  return (
    <div className="flex flex-col gap-5 items-center pb-24">
      <h1 className="text-center mt-10 text-4xl font-semibold">Pregled prodaje</h1>
      <form onSubmit={handlePregledProdaje} className="prodaja-datumi">
        <div>
          <label className="block mb-1">Godina:</label>
          <select value={godina} onChange={(e) => setGodina(Number(e.target.value))}>
            {Array.from({ length: trenutnaGodina - 2020 + 1 }, (_, i) => {
              const y = 2020 + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1">Početna sedmica:</label>
          <select value={sedmicaOd} onChange={(e) => setSedmicaOd(Number(e.target.value))}>
            {Array.from({ length: sedmicaUGodini }, (_, i) => {
              const w = i + 1;
              return (
                <option key={w} value={w}>
                  {w}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1">Završna sedmica:</label>
          <select value={sedmicaDo} onChange={(e) => setSedmicaDo(Number(e.target.value))}>
            {Array.from({ length: sedmicaUGodini - sedmicaOd + 1 }, (_, i) => {
              const w = sedmicaOd + i;
              return (
                <option key={w} value={w}>
                  {w}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" className="navigacija-dugme">
          Prikaži stanje prodaje
        </button>
      </form>
      {data && (
        <>
          <div ref={pdfRef} className="bg-white p-5 rounded">
            <ComposedChart width={650} height={500} data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="sedmica">
                <Label value="Sedmica" dy={25} />
              </XAxis>
              <YAxis yAxisId="left" orientation="left">
                <Label value="Prihodi (u KM)" angle={-90} position="insideLeft" dy={50} dx={-5} />
              </YAxis>
              <YAxis yAxisId="right" orientation="right">
                <Label value="Broj rezervacija" angle={90} position="insideRight" dy={50} dx={-5} />
              </YAxis>
              <Tooltip />
              <Legend verticalAlign="top" />
              <CartesianGrid stroke="#f5f5f5" />
              <Line yAxisId="left" type="monotone" dataKey="totalCijena" name="Ukupni prihodi" stroke="#ff7300" />
              <Bar yAxisId="right" dataKey="brojRezervacija" barSize={20} name="Broj rezervacije" fill="#413ea0" />
            </ComposedChart>
          </div>
          <button className="navigacija-dugme" onClick={downloadPDF}>
            Preuzmi kao PDF
          </button>
        </>
      )}
    </div>
  );
};

export default PregledProdaje;

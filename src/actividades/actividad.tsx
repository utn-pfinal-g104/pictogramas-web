import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ResponsiveAppBar from "../commons/appBar";
import { ICategoria } from "../pictogramas/models/categoria";
import { IPictogram } from "../pictogramas/models/pictogram";
import { ObtenerCategoriasIndexDB, ObtenerPictogramas } from "../pictogramas/services/pictogramas-services";
import { CategoriaDrop } from "./categoriaDrop";
import { PictogramaDrag } from "./pictogramaDrag";
import { Reglas } from "./reglas";

export default function Actividad(){
  const location = useLocation();
  const params = useParams();
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [categorias, setCategorias] = useState([] as ICategoria[])
  const reglas = useMemo(() => new Reglas(), []);

  const [categoria1, setCategoria1] = useState(null as ICategoria | null)
  const [categoria2, setCategoria2] = useState(null as ICategoria | null)
  const [pictograma, setPictograma] = useState(null as IPictogram | null)

  useEffect(() => {
    ObtenerCategoriasIndexDB().then((cats) => {
      setCategorias(cats)
    })
    ObtenerPictogramas().then((pics : IPictogram[]) => {
      setPictogramas(pics);      
    });
  }, [])

  useEffect(() => {
    setCategoria1(categorias[0])
    setCategoria2(categorias[1])
  }, [categorias]) 

  useEffect(() => {
    let pic = pictogramas.find((p : IPictogram) => 
      p.categorias?.some(c => c.id === categoria1?.id && c.id !== categoria2?.id))   
    pic === undefined ? setPictograma(null) : setPictograma(pic)
  }, [pictogramas])

  return(
    <div>
      {categoria1 && categoria2 && pictograma &&
        <div>
          <ResponsiveAppBar />
          Juego de Categorizar los Pictogramas - Nivel {params.nivel}
          <br/>
          {categoria1.nombre}:
          <CategoriaDrop pictograma={pictograma} categoria={categoria1} onDrop={() => {}} reglas={reglas}/>
          {categoria2.nombre}:
          <CategoriaDrop pictograma={pictograma} categoria={categoria2} onDrop={() => {}} reglas={reglas}/>
          <br />
          <PictogramaDrag pictograma={pictograma} onDrop={() => {}} reglas={reglas}/>
        </div>
      }
    </div>
  )
}
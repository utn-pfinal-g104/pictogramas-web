import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../login/model/usuario";
import { ICategoria } from "../pictogramas/models/categoria";
import { IPictogram } from "../pictogramas/models/pictogram";
import { IndexedDbService } from "./indexeddb-service";

var CryptoJS = require("crypto-js");
const apiPictogramas = window.__RUNTIME_CONFIG__.REACT_APP_URL_PICTOGRAMAS ?? "http://localhost:5000";
const encryptKey = window.__RUNTIME_CONFIG__.REACT_APP_ENCRYPT_KEY ?? "8080808080808080";
var indexDb = new IndexedDbService();
export let usuarioLogueado: IUsuario|null = null 

export function setUsuarioLogueadoVariable(
  usuario:IUsuario
  ) {
    usuarioLogueado = usuario
  }

export function setUsuarioLogueado(
  usuario:IUsuario
  ) {
    usuario.logueado = true;
    usuarioLogueado = usuario;
    indexDb.putOrPatchValue("usuarios",usuario);
  }

  export function cerrarSesionUsuario(    
    ) {
      if(usuarioLogueado){
        usuarioLogueado.logueado = false;
        indexDb.putOrPatchValue("usuarios", usuarioLogueado);
      }                  
    }

    export async function getUsuarioLogueado(){
        let dbService = await IndexedDbService.create();
        let usuarios: IUsuario[] = await dbService.getAllValues("usuarios");
        return usuarios.find(u => u.logueado)
    }

export async function ObtenerUsuarios(
  setUsuarios: any
) {
  axios.get(apiPictogramas + '/usuarios')
    .then(response => {
      setUsuarios(response.data)
    })
}

export async function ObtenerUsuarioInfo(id: number | undefined){
  return axios.get(apiPictogramas + '/usuarios/' + id)
    .then(response => {
      return response.data
    })
}

export async function ObtenerUsuario(
  username: string,
  password: string
) {
  return await axios.get(apiPictogramas + '/usuarios/' + username + '/' + password)
    .then(response => {
      console.log('usuario obtenido: ', response.data)
      return response.data
    })
}

export async function CrearUsuario(
  usuario:IUsuario  
  ) {    
    let user = {nombreUsuario: usuario.nombreUsuario, password : usuario.password} as IUsuario
    user.password = CryptoJS.AES.encrypt(user.password, encryptKey,
      {
        iv: encryptKey
      }
    ).toString()
    console.log(user.password)
    return await axios.post(apiPictogramas + '/usuarios',
      usuario
    )
    .then((resp) => {
      return resp.data
    })
}

export async function GuardarEstadistica(
  estadistica: any 
  ) {    
    return await axios.post(apiPictogramas + '/estadisticas',
      estadistica
    )
    .then((resp) => {
      return resp.data
    })
}

export async function ObtenerEstadisticas(
  usuario: any
) {
  return await axios.get(apiPictogramas + '/estadisticas/' + usuario)
    .then(response => {
      return response.data
    })
}

export async function ActualizarUsuario(
  usuario:IUsuario
  ) {
    console.log("Se actualiza el usuario en la api")
    await axios.put(apiPictogramas + '/usuarios',
      {
        Id: usuario.id, 
        NombreUsuario: usuario.nombreUsuario, 
        Password: usuario.password, 
        Schematic: usuario.schematic, 
        Sex: usuario.sex,
        Violence: usuario.violence,
        Aac: usuario.aac,
        AacColor: usuario.aacColor,
        Skin: usuario.skin,
        Hair: usuario.hair,
        Nivel: usuario.nivel,
        Imagen: usuario.imagen
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}

export async function ActualizarUsuarioPassword(
  usuario:IUsuario
  ) {
    // TODO: Revisar porque a la api no le llega el body
    await axios.patch(apiPictogramas + '/usuarios',
      {
        Id: usuario.id, 
        NombreUsuario: usuario.nombreUsuario, 
        Password: usuario.password, 
        Schematic: usuario.schematic, 
        Sex: usuario.sex,
        Violence: usuario.violence,
        Aac: usuario.aac,
        AacColor: usuario.aacColor,
        Skin: usuario.skin,
        Hair: usuario.hair,
        Nivel: usuario.nivel
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}

export async function SubirInformacionPictogramaPropio(
  body: IPictogram
){
  return await axios.post(apiPictogramas + `/usuarios/` +body.idUsuario + '/pictogramas',
    body,
    {
      headers: {
          'content-type': 'application/json'
      }
    }
    )
    .then(response => {
      return response.data
    })
}

export async function SubirImagenPropia(
  body: any
){
  return await axios.post(apiPictogramas + `/pictogramas/imagen`,
  body,
    {
      headers: {
          'content-type': 'application/json'
      }
    }
    )
    .then(response => {
      return response.data
    })
}

export async function ElmiminarPictogramaDeUsuario(idPictogramaUsuario: number) {

  return await axios.delete(apiPictogramas + `/pictogramas/pictogramasDeUsuario/${idPictogramaUsuario}`).then(() => {
    console.log('pictograma eliminado');
  });
}

export async function ObtenerFavoritosDeUsuario(idUsuario: number){
  return await axios.get(apiPictogramas + `/pictogramas/favoritos/${idUsuario}`).then((resp) => {
    console.log('favoritos obtenidos');
    return resp.data;
  })
}

export async function ObtenerCategoriasPorUsuario(idUsuario: number){
  return await axios.get(apiPictogramas + `/categoriasPorUsuario/${idUsuario}`).then((resp) => {
    console.log('PictogramasDeUsuarioObtenidos');
    return resp.data;
  })
}

export async function EliminarCategoriasPorUsuario(idUsuario: number, idCategoria: number) {
  return await axios.delete(apiPictogramas + '/categoriasPorUsuario/' + idUsuario + '/' + idCategoria).then((resp) => {
    return resp.data
  });
}

export async function InsertarCategoriasPorUsuario(idUsuario: number, idCategoria: number){
  return await axios.post(apiPictogramas + '/categoriasPorUsuario/' + idUsuario + '/' + idCategoria).then((resp) => {
    return resp.data
  });
}
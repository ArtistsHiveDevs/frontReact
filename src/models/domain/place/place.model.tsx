import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate } from "~/models/base";

export interface PlaceTemplate extends EntityTemplate {
  Nombre: string;
  profile_pic: string;
  Tipo: string;
  Género: string;
  País: string;
  Departamento: string;
  Ciudad: string;
  Dirección: string;
  "Lat, Long": string;
  "Sede principal": string;
  email: string;
  Teléfono: string;
  Carácter: string;
  FB: string;
  IG: string;
  Twitter: string;
  web: string;
  Responsable: string;
  tiktok: string;
}

export class PlaceModel
  extends EntityModel<PlaceTemplate>
  implements PlaceTemplate
{
  declare Nombre: string;
  declare profile_pic: string;
  declare Tipo: string;
  declare Género: string;
  declare País: string;
  declare Departamento: string;
  declare Ciudad: string;
  declare Dirección: string;
  declare "Lat, Long": string;
  declare "Sede principal": string;
  declare email: string;
  declare Teléfono: string;
  declare Carácter: string;
  declare FB: string;
  declare IG: string;
  declare Twitter: string;
  declare web: string;
  declare Responsable: string;
  declare tiktok: string;

  public get photo() {
    return this.profile_pic;
  }

  public get name() {
    return this.Nombre;
  }

  public get cardInfo() {
    return { title: this.Nombre };
  }

  public get place() {
    return this;
  }
}

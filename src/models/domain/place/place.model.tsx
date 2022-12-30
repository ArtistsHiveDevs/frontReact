import { VerificationStatus } from "~/constants";

export interface PlaceTemplate {
  id: string;
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

export class PlaceModel implements PlaceTemplate {
  id: string;
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

  constructor(private readonly template: PlaceTemplate) {
    this.id = this.template.id;
    this.Nombre = this.template.Nombre;
    this.profile_pic = this.template.profile_pic;
    this.Tipo = this.template.Tipo;
    this.Género = this.template.Género;
    this.País = this.template.País;
    this.Departamento = this.template.Departamento;
    this.Ciudad = this.template.Ciudad;
    this.Dirección = this.template.Dirección;
    this["Lat, Long"] = this.template["Lat, Long"];
    this["Sede principal"] = this.template["Sede principal"];
    this.email = this.template.email;
    this.Teléfono = this.template.Teléfono;
    this.Carácter = this.template.Carácter;
    this.FB = this.template.FB;
    this.IG = this.template.IG;
    this.Twitter = this.template.Twitter;
    this.web = this.template.web;
    this.Responsable = this.template.Responsable;
    this.tiktok = this.template.tiktok;
  }

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

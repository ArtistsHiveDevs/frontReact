import { FormLabel } from "@mui/material";
import { useState } from "react";
import { useI18n } from "~/common/utils";
import { ComponentGeneratorParams } from "../DynamicControl";
import { DynamicFieldData } from "../dynamic-control-types";
import { createSelect } from "./Select";

export enum CitySelectionLevel {
  CONTINENT,
  COUNTRY,
  STATE,
  CITY,
  DISTRICT,
  BOROUGH,
}

export interface CitySelectorParams extends ComponentGeneratorParams {
  highSelectionLevel?: CitySelectionLevel;
  minimumSelectionLevel?: CitySelectionLevel;
}

// interface CountryInfo {label:string, value:string, states:{label:string, value:string, cities:{label:string, value:string, districts?:{label?:string, value?:string}[]}[]}[]}

const countries: any = [
  {
    label: "Colombia",
    value: "CO",
    states: [
      {
        label: "Atlántico",
        value: "Atlántico",
        cities: [
          { label: "Barranquilla", value: "BQ", districts: [] },
          { label: "Santo Tomás", value: "ST", districts: [] },
        ],
      },
      {
        label: "Bolívar",
        value: "Bolívar",
        cities: [
          { label: "Cartagena", value: "CTG", districts: [] },
          { label: "Mompox", value: "MP", districts: [] },
        ],
      },
      {
        label: "Bogotá DC",
        value: "Bogotá",
        cities: [
          {
            label: "Bogotá DC",
            value: "BOG",
            districts: [
              { label: "La Candelaria", value: "CAND" },
              { label: "Chapinero", value: "Chapi" },
              { label: "Usaquén", value: "Usaquén" },
            ],
          },
        ],
      },
      {
        label: "Cauca",
        value: "Cauca",
        cities: [
          { label: "Popayán", value: "Pop", districts: [] },
          { label: "Silvia", value: "Sil", districts: [] },
        ],
      },
      {
        label: "Antioquia",
        value: "Antioquia",
        cities: [
          { label: "Medellín", value: "Med", districts: [] },
          { label: "Jardín", value: "JARd", districts: [] },
        ],
      },
    ],
  },
  {
    label: "Argentina",
    value: "AR",
    states: [
      {
        label: "Buenos Aires",
        value: "BA",
        cities: [{ label: "BsAs", value: "BsAs", districts: [] }],
      },
      {
        label: "Córdoba",
        value: "CB",
        cities: [{ label: "Córdoba", value: "cb", districts: [] }],
      },
      {
        label: "Salta",
        value: "SA",
        cities: [{ label: "Salta", value: "ST", districts: [] }],
      },
      {
        label: "Entre ríos",
        value: "ER",
        cities: [{ label: "Paraná", value: "PN", districts: [] }],
      },
      {
        label: "Santa Cruz",
        value: "SC",
        cities: [
          { label: "Río Gallegos", value: "Río Gallegos", districts: [] },
        ],
      },
    ],
  },
  {
    label: "México",
    value: "MX",
    states: [
      {
        label: "Ciudad de México",
        value: "CDMX",
        cities: [{ label: "CDMX", value: "CDMX", districts: [] }],
      },
      {
        label: "Morelos",
        value: "MO",
        cities: [
          { label: "Cuernavaca", value: "CV", districts: [] },
          { label: "Miacatlán", value: "MT", districts: [] },
        ],
      },
      {
        label: "Chiapas",
        value: "CS",
        cities: [{ label: "Tuxla Gutiérrez", value: "TG", districts: [] }],
      },
      {
        label: "Oaxaca",
        value: "OA",
        cities: [{ label: "Oaxaca de Juárez", value: "OX", districts: [] }],
      },
      {
        label: "Puebla",
        value: "PU",
        cities: [{ label: "Puebla de Zaragoza", value: "PZG", districts: [] }],
      },
    ],
  },
  {
    label: "Perú",
    value: "PE",
    states: [
      {
        label: "Arequipa",
        value: "Arequipa",
        cities: [{ label: "Arequipa", value: "Arequipa", districts: [] }],
      },
      {
        label: "Cuzco",
        value: "Cuzco",
        cities: [{ label: "Cuzco", value: "Cuzco", districts: [] }],
      },
      {
        label: "Ica",
        value: "ICA",
        cities: [{ label: "Ica", value: "Ica", districts: [] }],
      },
      {
        label: "Lima Metropolitana",
        value: "Lima",
        cities: [{ label: "Lima", value: "Lima", districts: [] }],
      },
      {
        label: "Loreto",
        value: "Lo",
        cities: [{ label: "Iquitos", value: "IQ", districts: [] }],
      },
    ],
  },
];

export const createCitySelect = (citySelectorParams: CitySelectorParams) => {
  const { formContext, fieldData, handlers } = citySelectorParams;
  const { register } = formContext;
  const [countryOptions, updateCountryOptions] = useState(countries);
  const [selectedCountry, updateSelectedCountry] = useState();
  const [stateOptions, updateStateOptions] = useState([]);
  const [selectedState, updateSelectedState] = useState();
  const [cityOptions, updateCityOptions] = useState([]);
  const [selectedCity, updateSelectedCity] = useState();
  const [districtOptions, updateDistrictOptions] = useState([]);
  const [selectedDistrict, updateSelectedDistrict] = useState();

  const customHandlers = {
    onChangecountry: (data: any) => {
      updateSelectedCountry(data.value);
      updateStateOptions(
        countries.find((country: any) => country.value === data.value).states
      );
    },
    onChangestate: (data: any) => {
      if (selectedCountry) {
        updateSelectedState(data.value);
        updateCityOptions(
          countries
            .find((country: any) => country.value === selectedCountry)
            .states?.find((state: any) => state.value === data.value).cities
        );
      }
    },
    onChangecity: (data: any) => {
      if (selectedCountry && selectedState) {
        updateSelectedCity(data.value);
        updateDistrictOptions(
          countries
            .find((country: any) => country.value === selectedCountry)
            .states?.find((state: any) => state.value === selectedState)
            .cities?.find((city: any) => city.value === data.value).districts
        );
      }
    },
  };
  const { translateText } = useI18n();

  const fieldDataCountries: DynamicFieldData = {
    label: translateText(`app.global_dictionary.location.country`),
    fieldName: "country",
    inputType: "select",
    options: countryOptions,
  };
  if (selectedCountry) {
    fieldDataCountries.defaultValue = selectedCountry;
  }
  const fieldDataStates: DynamicFieldData = {
    label: translateText(`app.global_dictionary.location.state`),
    fieldName: "state",
    inputType: "select",
    options: stateOptions,
  };
  const fieldDataCities: DynamicFieldData = {
    label: translateText(`app.global_dictionary.location.city`),
    fieldName: "city",
    inputType: "select",
    options: cityOptions,
  };
  const fieldDataDistricts: DynamicFieldData = {
    label: translateText(`app.global_dictionary.location.district`),
    fieldName: "district",
    inputType: "select",
    options: districtOptions,
  };

  return (
    <div>
      <FormLabel>{fieldData.label}</FormLabel>
      {createSelect({
        formContext,
        fieldData: fieldDataCountries,
        handlers: customHandlers,
      })}
      {createSelect({
        formContext,
        fieldData: fieldDataStates,
        handlers: customHandlers,
      })}
      {createSelect({
        formContext,
        fieldData: fieldDataCities,
        handlers: customHandlers,
      })}
      {createSelect({
        formContext,
        fieldData: fieldDataDistricts,
        handlers: customHandlers,
      })}
    </div>
  );
};

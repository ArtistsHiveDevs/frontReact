import moment from "moment";
import Flag from "react-world-flags";
import { currencyFormat } from "~/common/utils/string-utils";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { formatDateInMomentType } from "~/constants";
import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";

function formatDate(date: string) {
  const newDate = moment(date);
  const dateFormat =
    newDate.year() === moment(moment.now()).year()
      ? "dddd, MMMM DD"
      : "dddd, MMMM DD (YYYY)";
  return formatDateInMomentType(date, dateFormat);
}
export const TOUR_OUTLINE_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: "general",
    sections: [
      {
        name: "dates",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "initial_date",
                  value: (tourOutline: TourOutlineModel) => {
                    return formatDate(
                      tourOutline.summary.days.initial_date.toString()
                    );
                  },
                },
                {
                  name: "final_date",
                  value: (tourOutline: TourOutlineModel) => {
                    return formatDate(
                      tourOutline.summary.days.final_date.toString()
                    );
                  },
                },
                {
                  name: "total_days",
                  value: (tourOutline: TourOutlineModel) => {
                    return `${tourOutline.totalDays} days`;
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: "shows",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "countries",
                  emptyTitle: true,
                  value: (tourOutline: TourOutlineModel) => {
                    const flags = {
                      Colombia: "co",
                      España: "es",
                      Inglaterra: "GB-ENG",
                    };
                    return tourOutline.summary.countries.map(
                      (country, index, countries) => (
                        <p key={country.name}>
                          <Flag
                            code={flags[country.name as keyof typeof flags]}
                            height="15"
                            style={{ border: "1px solid #999" }}
                          />{" "}
                          <b>{country.name}</b>
                          <br />
                          {country.cities.join(", ")}
                        </p>
                      )
                    );
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "dates",
    sections: [
      {
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              render: (data: any) => {
                console.log("---- ", data);

                // return <p>sdasdasd</p>;
                return <>ggg</>;
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: "budget",
    sections: [
      {
        name: "accommodation",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              render: (tourOutline: TourOutlineModel) => {
                const icons = {
                  airbnb: "FaAirbnb",
                  booking: "MdHotel",
                  hotels: "FaHotel",
                  house_rental: "IoHome",
                };

                const budget = tourOutline?.summary?.budget;

                const total = Object.keys(budget?.accomodation || [])
                  .map(
                    (medium) =>
                      budget.accomodation[
                        medium as keyof typeof budget.accomodation
                      ]
                  )
                  .reduce(
                    (accumulated, currentValue) => accumulated + currentValue,
                    0
                  );

                const totalPerDay = Math.ceil(total / tourOutline.totalDays);

                const subitems: IconDetailedAttribute[] = Object.keys(
                  budget.accomodation
                ).map((subitem) => {
                  return {
                    name: subitem,
                    title: subitem,
                    icon: icons[subitem as keyof typeof icons],
                    value: `${currencyFormat(
                      budget.accomodation[
                        subitem as keyof typeof budget.accomodation
                      ]
                    )}`,
                  };
                });

                subitems.push({
                  name: "total",
                  title: "Total",
                  icon: "BsCashCoin",
                  value: `${currencyFormat(total)}`,
                });

                subitems.push({
                  name: "totalPerDay",
                  icon: "BsCashCoin",
                  title: `Total per Day (${tourOutline.totalDays} days)`,
                  value: `${currencyFormat(totalPerDay)}`,
                });

                return (
                  <AttributesIconFieldReadOnly
                    key={`accomodation`}
                    attributes={subitems}
                  />
                );
              },
            },
          },
        ],
      },
      {
        name: "intercity_transportation",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              render: (tourOutline: TourOutlineModel) => {
                const icons = {
                  boats: "GiSailboat",
                  car: "BiCar",
                  car_rental: "MdCarRental",
                  flights: "MdFlight",
                  private_bus: "FaShuttleVan",
                  public_bus: "FaBus",
                  train: "BiTrain",
                };

                const budget = tourOutline?.summary?.budget;

                const total = Object.keys(
                  budget?.transportation?.intercity_transportation || []
                )
                  .map(
                    (medium) =>
                      budget.transportation?.intercity_transportation[
                        medium as keyof typeof budget.transportation.intercity_transportation
                      ]
                  )
                  .reduce(
                    (accumulated, currentValue) => accumulated + currentValue,
                    0
                  );

                const totalPerDay = Math.ceil(total / tourOutline.totalDays);

                const subitems: IconDetailedAttribute[] = Object.keys(
                  budget.transportation.intercity_transportation
                ).map((subitem) => {
                  return {
                    name: subitem,
                    title: subitem,
                    icon: icons[subitem as keyof typeof icons],
                    value: `${currencyFormat(
                      budget.transportation.intercity_transportation[
                        subitem as keyof typeof budget.transportation.intercity_transportation
                      ]
                    )}`,
                  };
                });

                subitems.push({
                  name: "total",
                  title: "Total",
                  icon: "BsCashCoin",
                  value: `${currencyFormat(total)}`,
                });

                return (
                  <AttributesIconFieldReadOnly
                    key={`intercity_transportation`}
                    attributes={subitems}
                  />
                );
              },
            },
          },
        ],
      },
      {
        name: "internal_transportation",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              render: (tourOutline: TourOutlineModel) => {
                const icons = {
                  uber: "SiUber",
                  bike: "MdPedalBike",
                  motorbike: "RiMotorbikeFill",
                  car: "BiCar",
                  car_rental: "MdCarRental",
                  public_transportation: "FaSubway",
                  van: "FaShuttleVan",
                };

                const budget = tourOutline?.summary?.budget;

                const total = Object.keys(
                  budget?.transportation?.internal_transportation || []
                )
                  .map(
                    (medium) =>
                      budget.transportation?.internal_transportation[
                        medium as keyof typeof budget.transportation.internal_transportation
                      ]
                  )
                  .reduce(
                    (accumulated, currentValue) => accumulated + currentValue,
                    0
                  );

                const totalPerDay = Math.ceil(total / tourOutline.totalDays);

                const subitems: IconDetailedAttribute[] = Object.keys(
                  budget.transportation.internal_transportation
                ).map((subitem) => {
                  return {
                    name: subitem,
                    title: subitem,
                    icon: icons[subitem as keyof typeof icons],
                    value: `${currencyFormat(
                      budget.transportation.internal_transportation[
                        subitem as keyof typeof budget.transportation.internal_transportation
                      ]
                    )}`,
                  };
                });

                subitems.push({
                  name: "total",
                  title: "Total",
                  icon: "BsCashCoin",
                  value: `${currencyFormat(total)}`,
                });

                subitems.push({
                  name: "totalPerDay",
                  icon: "BsCashCoin",
                  title: `Total per Day (${tourOutline.totalDays} days)`,
                  value: `${currencyFormat(totalPerDay)}`,
                });

                return (
                  <AttributesIconFieldReadOnly
                    key={`internal_transportation`}
                    attributes={subitems}
                  />
                );
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: "wishes",
    sections: [
      {
        name: "guest_artists",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "likedArtists",
            },
          },
        ],
      },
      {
        name: "possible_shows",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "likedPlaces",
            },
          },
        ],
      },
    ],
  },
  {
    name: "settings",
    sections: [],
  },
];

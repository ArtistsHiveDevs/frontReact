import React from "react";
import EntityCard from "~/components/shared/Cards/EntityCard";
import NewEntityCard from "~/components/shared/Cards/NewEntityCard";
import { EntityModel, EntityTemplate } from "~/models/base";
import "./index.scss";

type MainSectionInputParams = {
  title?: string;
  titleAlign?: any;
  description?: string;
  listView?: EntityModel<EntityTemplate>[];
  params?: { [nameParam: string]: any };
  callbacks?: { [nameParam: string]: Function };
  orientation?: string;
  columnNumber?: number;
};

const MainSection: React.FC<MainSectionInputParams> = (
  props: MainSectionInputParams
) => {
  const {
    title,
    description,
    listView,
    params,
    callbacks,
    titleAlign: titleAlineation,
    orientation,
  } = props;

  return (
    <div className="main-section">
      <>
        <h3
          className={`main-section-title`}
          style={{ textAlign: titleAlineation || "left" }}
        >
          {title}
        </h3>
        <p>{description}</p>
        <div className={`cards-container-${orientation || "horizontal"}`}>
          {listView?.map((element: any, idx: any) => {
            return !!params?.useNewCard ? (
              <div key={`new-entity-cart-detail-${idx}`}>
                <NewEntityCard
                  data={element}
                  idx={idx}
                  params={params}
                  callbacks={callbacks}
                />
              </div>
            ) : (
              <div key={`entity-cart-detail-${idx}`}>
                <EntityCard data={element} idx={idx} params={params} />
              </div>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default MainSection;

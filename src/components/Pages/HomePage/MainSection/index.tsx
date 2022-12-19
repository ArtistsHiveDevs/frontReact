import React from "react";
import EntityCard from "~/components/shared/Cards/EntityCard";
import NewEntityCard from "~/components/shared/Cards/NewEntityCard";
import ModalCardInfo from "~/components/shared/Modals/ModalCardInfo";
import "./index.scss";

const MainSection = (props: any) => {
  const { title, description, listView, params } = props;
  return (
    <section className="main-section">
      <>
        <h3 className="main-section-title">{title}</h3>
        <p>{description}</p>
        <div className="cards-container">
          {listView?.map((element: any, idx: any) => {
            return !!params?.useNewCard ? (
              <div key={`new-entity-cart-detail-${idx}`}>
                <NewEntityCard data={element} idx={idx} params={params} />
              </div>
            ) : (
              <div key={`entity-cart-detail-${idx}`}>
                <EntityCard data={element} idx={idx} params={params} />
              </div>
            );
          })}
        </div>
      </>
    </section>
  );
};

export default MainSection;

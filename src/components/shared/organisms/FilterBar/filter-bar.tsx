import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./filter-bar.scss";
import { EntityTemplate, SearchableTemplate } from "~/models/base";
import { SearchComponent } from "../../search";
import React, { useState } from "react";
import SelectListComponent from "../../molecules/domain/SelectList/select-list";
import CalendarDatePickupComponent from "../../molecules/domain/CalendarDatePicker/calendar-date-picker";

type FilterVarTemplate = {
  categories?: string[];
};

const FilterBarComponent: React.FC<FilterVarTemplate> = (
  props: FilterVarTemplate
) => {
  const [restartFilters, updateRestartFilters] = useState(null);
  function handleTipResultOnClick(element: SearchableTemplate) {
    console.log({ element });
  }

  function handleSelectedCategory(event: string) {
    console.log({ category: event });
  }

  function handleDatePickerSelect(event: any) {
    console.log({ eventDate: event });
  }

  function handleOnRestartClick() {
    console.log("clic");
    updateRestartFilters(!restartFilters);
  }

  const mockList = [
    { label: "Todos", value: "0" },
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
    { label: "Three", value: "3" },
    { label: "Four", value: "4" },
    { label: "Five", value: "5" },
  ];

  return (
    <Container className="filter-bar-container">
      <Row className="filter-bar-general">
        <Col sm={3}>
          <Row className="label-filter-opt">Categorías</Row>
          <Row className="filter-opt-container">
            <SelectListComponent
              list={mockList}
              callback={handleSelectedCategory}
            />
          </Row>
        </Col>
        <Col>
          <Row className="label-filter-opt">Fecha</Row>
          <Row className="filter-opt-container">
            <CalendarDatePickupComponent callback={handleDatePickerSelect} />
          </Row>
        </Col>
        <Col sm={4}>
          <Row className="label-filter-opt">Buscar</Row>
          <Row className="filter-opt-container">
            <SearchComponent
              openedStatus={true}
              onClick={handleTipResultOnClick}
              hideResultHeader={true}
            />
          </Row>
        </Col>
        <Col sm={2}>
          <div className="bar-restart-button">
            <Button
              onClick={(e) => handleOnRestartClick()}
              className="button-styles"
            >
              Reiniciar
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterBarComponent;

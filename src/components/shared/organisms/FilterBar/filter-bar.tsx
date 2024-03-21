import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './filter-bar.scss';
import { EntityTemplate, SearchableTemplate } from '~/models/base';
import { SearchComponent } from '../../search';
import React, { useRef, useState } from 'react';
import SelectListComponent from '../../molecules/domain/SelectList/select-list';
import CalendarDatePickupComponent from '../../molecules/domain/CalendarDatePicker/calendar-date-picker';
import { EntityType } from '../../search/search-constants';

export enum FilterOptions {
  CATEGORIES = 'categories',
  DATE = 'date',
  RESET = 'reset',
  SEARCH = 'search',
}

type ListElementOption = {
  label: string;
  value: string;
};

type CallbackOpts = {
  categories?: Function;
  date?: Function;
  reset?: Function;
  search?: Function;
};

type FilterVarTemplate = {
  categories?: ListElementOption[];
  callbacks?: CallbackOpts;
};

const FilterBarComponent: React.FC<FilterVarTemplate> = (props: FilterVarTemplate) => {
  const categoriesReference = useRef(null);
  const searchBarReference = useRef(null);
  const calendarReference = useRef(null);

  function handleTipResultOnClick(event: SearchableTemplate) {
    if (props?.callbacks[FilterOptions.SEARCH]) {
      categoriesReference.current.restartPickValue();
      calendarReference.current.restartDatePickValue();
      props?.callbacks[FilterOptions.SEARCH](event);
    }
  }

  function handleSelectedCategory(event: string) {
    if (props?.callbacks[FilterOptions.CATEGORIES]) {
      searchBarReference.current.restartQueryValue();
      calendarReference.current.restartDatePickValue();
      props?.callbacks[FilterOptions.CATEGORIES](event);
    }
  }

  function handleDatePickerSelect(event: string) {
    if (props?.callbacks[FilterOptions.DATE]) {
      categoriesReference.current.restartPickValue();
      searchBarReference.current.restartQueryValue();
      props?.callbacks[FilterOptions.DATE](event);
    }
  }

  function handleOnRestartClick() {
    categoriesReference.current.restartPickValue();
    searchBarReference.current.restartQueryValue();
    calendarReference.current.restartDatePickValue();
    if (props?.callbacks[FilterOptions.RESET]) {
      props?.callbacks[FilterOptions.RESET]();
    }
  }

  return (
    <Container className="filter-bar-container">
      <Row className="filter-bar-general">
        <Col sm={3}>
          <Row className="label-filter-opt">Categorías</Row>
          <Row className="filter-opt-container">
            <SelectListComponent
              list={props?.categories}
              callback={handleSelectedCategory}
              parentReference={categoriesReference}
            />
          </Row>
        </Col>
        <Col>
          <Row className="label-filter-opt">Fecha</Row>
          <Row className="filter-opt-container">
            <CalendarDatePickupComponent callback={handleDatePickerSelect} parentReference={calendarReference} />
          </Row>
        </Col>
        <Col sm={4}>
          <Row className="label-filter-opt">Buscar</Row>
          <Row className="filter-opt-container">
            <SearchComponent
              openedStatus={true}
              onClick={handleTipResultOnClick}
              hideResultHeader={true}
              parentReference={searchBarReference}
              typeOfSearch={[EntityType.ARTISTS]}
            />
          </Row>
        </Col>
        <Col sm={2}>
          <div className="bar-restart-button">
            <Button onClick={(e) => handleOnRestartClick()} className="button-styles">
              Reiniciar
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterBarComponent;

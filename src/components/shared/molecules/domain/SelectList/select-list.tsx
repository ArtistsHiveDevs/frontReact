import { MutableRefObject, useImperativeHandle, useState } from 'react';
import { Container, Form } from 'react-bootstrap';

type ListElementOption = {
  label: string;
  value: string;
};

type SelectListTemplate = {
  list: ListElementOption[];
  callback?: Function;
  parentReference?: MutableRefObject<any>;
};

const SelectListComponent: React.FC<SelectListTemplate> = (props: SelectListTemplate) => {
  const defaultValue = 'default';
  const [selectedValue, updateSelectedValue] = useState(defaultValue);

  function handleChangeSelect(event: string) {
    updateSelectedValue(event);
    if (props?.callback) {
      props?.callback(event);
    }
  }

  useImperativeHandle(props?.parentReference, () => ({
    restartPickValue() {
      updateSelectedValue(defaultValue);
    },
  }));

  return (
    <Container className="drop-down-list-container">
      <Form.Select
        aria-label="Default select example"
        className="list-select"
        value={selectedValue}
        onChange={(event) => handleChangeSelect(event.target.value)}
      >
        <option value={'default'}>Seleccione una opción</option>
        {props.list.map((listElement: ListElementOption, idx: number) => {
          return (
            <option key={`option-list-${idx}-${listElement.value}`} value={listElement.value}>
              {listElement.label}
            </option>
          );
        })}
      </Form.Select>
    </Container>
  );
};

export default SelectListComponent;

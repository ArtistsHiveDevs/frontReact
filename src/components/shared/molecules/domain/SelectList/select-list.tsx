import { useState } from "react";
import { Container, Form } from "react-bootstrap";

type ListElementOption = {
  label: string;
  value: string;
  isDefault?: boolean;
};

type SelectListTemplate = {
  list: ListElementOption[];
  callback?: Function;
};

const SelectListComponent: React.FC<SelectListTemplate> = (
  props: SelectListTemplate
) => {
  const findDefaultValue =
    props.list.find((category) => category?.isDefault)?.value ||
    props.list[0].value;
  const [selectedValue, updateSelectedValue] = useState(findDefaultValue);

  function handleChangeSelect(event: string) {
    updateSelectedValue(event);
    if (props?.callback) {
      props?.callback(event);
    }
  }

  return (
    <Container className="drop-down-list-container">
      <Form.Select
        aria-label="Default select example"
        className="list-select"
        value={selectedValue}
        onChange={(event) => handleChangeSelect(event.target.value)}
      >
        {props.list.map((listElement: ListElementOption, idx: number) => {
          return (
            <option
              key={`option-list-${idx}-${listElement.value}`}
              value={listElement.value}
            >
              {listElement.label}
            </option>
          );
        })}
      </Form.Select>
    </Container>
  );
};

export default SelectListComponent;

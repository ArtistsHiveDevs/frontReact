import { Container, Form } from "react-bootstrap";
import "./calendar-date-picker.scss";
import moment from "moment";

type CalendarDatePickupTemplate = {
  initialDate?: string;
  callback?: Function;
};

const CalendarDatePickupComponent: React.FC<CalendarDatePickupTemplate> = (
  props: CalendarDatePickupTemplate
) => {
  let datePickerValue = props?.initialDate;
  function handlePickerOnChange(event: any) {
    if (props?.callback) {
      props?.callback(event);
    }
  }
  return (
    <Container>
      <div>
        <Form.Group controlId="dob">
          <Form.Control
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={datePickerValue}
            onChange={(event) => handlePickerOnChange(event.target.value)}
          />
        </Form.Group>
      </div>
    </Container>
  );
};

export default CalendarDatePickupComponent;

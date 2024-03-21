import { Container, Form } from 'react-bootstrap';
import './calendar-date-picker.scss';
import moment from 'moment';
import { MutableRefObject, useImperativeHandle, useState } from 'react';

type CalendarDatePickupTemplate = {
  initialDate?: string;
  callback?: Function;
  parentReference?: MutableRefObject<any>;
};

const CalendarDatePickupComponent: React.FC<CalendarDatePickupTemplate> = (props: CalendarDatePickupTemplate) => {
  const today = new Date();
  const [datePickerValue, updateSelectedValue] = useState(props?.initialDate || '');
  function handlePickerOnChange(event: any) {
    // if (moment(event).toDate() < today) {
    //   updateSelectedValue(props?.initialDate || "");
    // } else {
    //   updateSelectedValue(event);

    //   if (props?.callback) {
    //     props?.callback(event);
    //   }
    // }
    updateSelectedValue(event);
    if (props?.callback) {
      props?.callback(event);
    }
  }
  useImperativeHandle(props?.parentReference, () => ({
    restartDatePickValue() {
      updateSelectedValue(props?.initialDate || '');
    },
  }));
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

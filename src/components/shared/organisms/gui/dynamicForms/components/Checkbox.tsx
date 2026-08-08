import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createCheckbox = (params: ComponentGeneratorParams) => {
  const { register, errors, fieldData } = params;
  const { label, fieldName, options = [], config = {}, componentParams = {} } = fieldData;

  const { labelAsCheck } = componentParams;

  const labelAsSingleOption = labelAsCheck === undefined && !!label && options.length === 0;

  const [mainFieldChecked, setMainFieldChecked] = useState<boolean>(false);
  const [optionsChecked, setOptionsChecked] = useState<boolean[]>(new Array(options.length).fill(false));
  const [indeterminate, setIndeterminate] = useState(false);

  const required = !!config.required;

  const handleMainFieldChange = () => {
    const newMainFieldChecked = !mainFieldChecked;
    const newOptionsChecked = new Array(options.length).fill(newMainFieldChecked);
    setMainFieldChecked(newMainFieldChecked);

    updateOptionsState(newOptionsChecked);
  };

  const handleOptionChange = (index: number) => {
    const newOptionsChecked = [...optionsChecked];
    newOptionsChecked[index] = !newOptionsChecked[index];
    updateOptionsState(newOptionsChecked);
  };

  const updateOptionsState = (newOptionsChecked: boolean[]) => {
    if (options.length > 0) {
      setOptionsChecked(newOptionsChecked);

      const allChecked = newOptionsChecked.every((checked) => checked);
      const noneChecked = newOptionsChecked.every((checked) => !checked);

      setIndeterminate(!allChecked && !noneChecked);
      if (allChecked) {
        setMainFieldChecked(true);
      } else if (noneChecked) {
        setMainFieldChecked(false);
      }

      options.forEach((option, index) => register(`${fieldName}_${option.label}`, { value: newOptionsChecked[index] }));
    }
  };

  useEffect(() => {
    register(fieldName, { value: indeterminate ? false : mainFieldChecked });
  }, [mainFieldChecked]);

  useEffect(() => {
    setMainFieldChecked(!indeterminate ? mainFieldChecked : false);
  }, [indeterminate]);

  return (
    <FormGroup>
      {label && (
        <>
          {labelAsSingleOption ? (
            <>
              <FormControlLabel
                control={<Checkbox checked={mainFieldChecked} onChange={handleMainFieldChange} />}
                label={
                  <FormLabel required={required} onClick={handleMainFieldChange}>
                    {label}
                  </FormLabel>
                }
              />
            </>
          ) : (
            <>
              {options.length > 0 &&
                ((labelAsCheck && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mainFieldChecked}
                        indeterminate={indeterminate}
                        onChange={handleMainFieldChange}
                      />
                    }
                    label={
                      <FormLabel required={required} onClick={handleMainFieldChange}>
                        {label}
                      </FormLabel>
                    }
                  />
                )) ||
                  (!labelAsCheck && <FormLabel required={required}>{label}</FormLabel>))}
            </>
          )}
        </>
      )}
      {options.length > 0 && (
        <div style={{ paddingLeft: labelAsSingleOption ? '1rem' : 0 }}>
          {options.map((option, index) => (
            <FormControlLabel
              key={`${fieldName}-check-${index}`}
              control={<Checkbox checked={optionsChecked[index]} onChange={() => handleOptionChange(index)} />}
              label={
                <FormLabel required={required} onClick={() => handleOptionChange(index)}>
                  {option.label}
                </FormLabel>
              }
            />
          ))}
        </div>
      )}
    </FormGroup>
  );
};

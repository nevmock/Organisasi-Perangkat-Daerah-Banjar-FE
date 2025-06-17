import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import debounce from 'lodash.debounce';

const Selection = ({
  key = null,
  className = 'form-select form-select-solid',
  value,
  name = '',
  onChange = (e) => {},
  invalidParam = false,
  disabled = false,
  placeHolder = '',
  children = null,
  defaultValue = '',
  style = {},
  validations = {
    valid: false,
    data: null,
    errors: {},
  },
  validationName = '',
  validationStyle = {},
  enableCustomOption = false,
  onInputChange = (e) => {},
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [options, setOptions] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);

  const SelectComponent = enableCustomOption ? CreatableSelect : Select;

  const debouncedInputChange = useCallback(
    debounce((inputValue) => {
      if (onInputChange) {
        onInputChange(inputValue);
      }
    }, 500),
    [onInputChange]
  );

  const handleInputChange = (value) => {
    setMenuIsOpen(true);
    onInputChange(value);
  };

  useEffect(() => {
    if (children) {
      const childObj = Children.toArray(children)
        .filter((child) => isValidElement(child) && child.type === 'option')
        .map((child) => {
          return {
            label: child.props.children,
            value: child.props.value,
            isDisabled: child.props.disabled,
          };
        });

      setOptions(childObj);
    }
  }, [children]);

  useEffect(() => {
    if (options) {
      if (!options?.find((v) => v?.value === value)) {
        if (String(value) != '') {
          setCurrentOptions([
            ...options,
            { label: value, value: value, isDisabled: false },
          ]);
        }
      } else {
        setCurrentOptions(options);
      }
    }
  }, [options, value]);

  return (
    <div>
      <SelectComponent
        key={key}
        id={name}
        styles={{
          control: (base, state) => ({
            margin: 0,
            ...base,
            ...style,
            boxShadow: state.isFocused ? '#dfe3e8' : undefined,
            borderColor: state.isFocused ? '#dfe3e8' : '#dfe3e8',
            padding: '4px',
            borderRadius: '6px',
            '&:hover': {
              borderColor: state.isFocused ? '#dfe3e8' : '#dfe3e8',
            },
          }),
          valueContainer: (base) => ({
            ...base,
            margin: 0,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }),
          placeholder: (base) => ({
            ...base,
            margin: 0,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            color: '#637381',
          }),
          singleValue: (base) => ({
            ...base,
            margin: 0,
          }),
        }}
        onCreateOption={(inputValue) => {
          if (enableCustomOption) {
            const newOption = {
              label: inputValue,
              value: inputValue,
              isDisabled: false,
            };
            setCurrentOptions([
              ...currentOptions,
              options?.find((v) => v?.value === inputValue)
                ? undefined
                : newOption,
            ]);

            if (String(inputValue) != '') {
              const customElement = {
                target: {
                  name: name,
                  value: inputValue,
                },
              };
              onChange(customElement);
            }
          }
        }}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
        }}
        isDisabled={disabled}
        classNames={{
          control: () =>
            `${className}  ${
              !validations.valid &&
              Object.keys(validations?.errors).some(
                (key) => key === validationName
              )
                ? 'border border-danger'
                : ''
            }`,
        }}
        value={value ? { label: value, value: value, isDisabled: false } : null}
        name={name}
        onChange={(e) => {
          const customEvent = {
            target: {
              name: name,
              value: e ? e.value : '',
            },
          };

          if (e && String(e?.value) != '') {
            onChange(customEvent);
          }

          setMenuIsOpen(false);
        }}
        options={currentOptions}
        placeholder={placeHolder || 'Select an option'}
        isClearable={false}
        onInputChange={handleInputChange}
        menuIsOpen={menuIsOpen}
        onMenuClose={() => setMenuIsOpen(false)}
        onBlur={() => setMenuIsOpen(false)}
        onMenuOpen={() => setMenuIsOpen(true)}
      />

      {validations?.errors !== null &&
        Object.keys(validations?.errors).map((key, index) => {
          if (key === validationName) {
            return validations?.errors[key].map((error, errorIndex) => {
              return (
                <div style={validationStyle} key={errorIndex}>
                  <p className="text-sm text-danger mt-2">{error}</p>
                </div>
              );
            });
          }
          return null;
        })}
    </div>
  );
};

export default Selection;

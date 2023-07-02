import React, { useState } from 'react';
import Select from 'react-select';

function MyComponent() {
  const options = [
    { value: 'value1', label: 'Option 1' },
    { value: 'value2', label: 'Option 2' },
    { value: 'value3', label: 'Option 3' }
  ];

  const [selectedOptions, setSelectedOptions] = useState([options[0]]);
  console.log(selectedOptions)
  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  return (
    <div className=''>
      <Select
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleSelectChange}
      />
    </div>
  );
}

export default MyComponent;
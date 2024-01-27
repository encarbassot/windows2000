import React, { useState } from 'react';

const Calculator = () => {
  const [input, setInput] = useState('');

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleCalculate = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <div>
      <input type="text" value={input} readOnly />
      <br />
      <button onClick={() => handleButtonClick('7')}>7</button>
      <button onClick={() => handleButtonClick('8')}>8</button>
      <button onClick={() => handleButtonClick('9')}>9</button>
      <button onClick={() => handleButtonClick('/')}>/</button>
      <br />
      <button onClick={() => handleButtonClick('4')}>4</button>
      <button onClick={() => handleButtonClick('5')}>5</button>
      <button onClick={() => handleButtonClick('6')}>6</button>
      <button onClick={() => handleButtonClick('*')}>*</button>
      <br />
      <button onClick={() => handleButtonClick('1')}>1</button>
      <button onClick={() => handleButtonClick('2')}>2</button>
      <button onClick={() => handleButtonClick('3')}>3</button>
      <button onClick={() => handleButtonClick('-')}>-</button>
      <br />
      <button onClick={() => handleButtonClick('0')}>0</button>
      <button onClick={() => handleButtonClick('.')}>.</button>
      <button onClick={handleCalculate}>=</button>
      <button onClick={() => handleButtonClick('+')}>+</button>
      <br />
      <button onClick={handleClear}>Clear</button>
      <br />
    </div>
  );
};

export default Calculator;

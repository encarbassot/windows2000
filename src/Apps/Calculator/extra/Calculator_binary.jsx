import { useEffect, useState } from "react";




const ACTIONS = {
  CONV_BASE: 'Conv. base',
  // CONV_UNITS: 'Conv. units',
  TWO_OP: '2 op',
  // ONE_OP: '1 op',
  LOG_BASE: 'log & base'
}

const UNIT_FACTORS = {
  bit: { value: 1, name: 'Bit' },
  byte: { value: 8, name: 'Byte' },
  kbit: { value: 1000, name: 'Kbit' },
  kibit: { value: 1024, name: 'Kibit' },
  kbyte: { value: 8000, name: 'KByte' },
  kibyte: { value: 8192, name: 'KiByte' },
  mbit: { value: 1000 * 1000, name: 'Mbit' },
  mibit: { value: 1024 * 1024, name: 'Mibit' },
  mbyte: { value: 8000 * 1000, name: 'MByte' },
  mibyte: { value: 8192 * 1024, name: 'MiByte' },
  gbit: { value: 1000 ** 3, name: 'Gbit' },
  gibit: { value: 1024 ** 3, name: 'Gibit' },
  gbyte: { value: 8000 * 1000 ** 2, name: 'GByte' },
  gibyte: { value: 8192 * 1024 ** 2, name: 'GiByte' }
}

const TWO_OPS = [
  "AND",
  "NAND",
  "OR",
  "NOR",
  "XOR",
  "XNOR",
]

export default function Calculator_binary() {


  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [selected , setSelected] = useState(ACTIONS.CONV_BASE);

  // Convert Base
  const [inpHex, setInpHex] = useState('');
  const [inpDec, setInpDec] = useState('');
  const [inpBin, setInpBin] = useState('');

  // convert Units
  const [inpUnitValue, setInpUnitValue] = useState('');

  // Two Op
  const [twoOpOperation, setTwoOpOperation] = useState(TWO_OPS[0]);
  const [twoOpResult, setTwoOpResult] = useState('');


  // log & base
  const [inpExp, setInpExp] = useState('');
  const [resultExp, setResultExp] = useState('');

  const [inpLog, setInpLog] = useState('');
  const [resultLog, setResultLog] = useState('');


  useEffect(() => {
    if (inpExp === '') {
      setResultExp('')
      return
    }
    const exp = parseInt(inpExp)
    if (isNaN(exp) || exp < 0) {
      setResultExp('')
      return
    }
    setResultExp(Math.pow(2, exp))
  }, [inpExp])
  
  useEffect(() => {
    if (inpLog === '') {
      setResultLog('')
      return
    }
    const log = parseInt(inpLog)
    if (isNaN(log) || log <= 0) {
      setResultLog('')
      return
    }
    const logValue = Math.log2(log)
    setResultLog(
      Number.isInteger(logValue) ? logValue.toString() : logValue.toFixed(3)
    )
    }, [inpLog])
  






  function handleLoadRegister(register,from){
    if(register === "a"){
      setInputA(from);
    } else if(register === "b"){
      setInputB(from);
    }
  }


  // Convert Base

  function handleChangeConvBase(base,value){
    if(base === "Hex"){
      setInpHex(value);
      setInpDec(parseInt(value, 16).toString(10));
      setInpBin(parseInt(value, 16).toString(2));
    } else if(base === "Dec"){
      setInpDec(value);
      setInpHex(parseInt(value, 10).toString(16).toUpperCase());
      setInpBin(parseInt(value, 10).toString(2));
    } else if(base === "Bin"){
      setInpBin(value);
      setInpHex(parseInt(value, 2).toString(16).toUpperCase());
      setInpDec(parseInt(value, 2).toString(10));
    }
  }




  // Convert Units


  // Two Op

  function handleCalcTwoOp() {
    const a = inputA.padStart(16, '0')
    const b = inputB.padStart(16, '0')
  
    const ops = {
      AND: (x, y) => x && y,
      NAND: (x, y) => !(x && y),
      OR: (x, y) => x || y,
      NOR: (x, y) => !(x || y),
      XOR: (x, y) => x !== y,
      XNOR: (x, y) => x === y
    }
  
    if (!ops[twoOpOperation]) return
  
    let res = ''
  
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const av = a[a.length - 1 - i] === '1'
      const bv = b[b.length - 1 - i] === '1'
      res = (ops[twoOpOperation](av, bv) ? '1' : '0') + res
    }
  
    setTwoOpResult(res.replace(/^0+(?!$)/, ''))
  }

  return (
    <div className="Calculator__app binary">
      <div className="header">
        <p className="register a">
          <label>A</label>
          <input type="text" value={inputA} onChange={e=>setInputA(filterBinary(e.target.value))}/>
        </p>
        <p className="register b">
          <label>B</label>
          <input type="text" value={inputB} onChange={e=>setInputB(filterBinary(e.target.value))} />
        </p>
      </div>
      <div className="actions">
        {Object.values(ACTIONS).map((action, i) => (
          <button key={i} className={"button"+(selected===action?" active":"")}
            onClick={()=> setSelected(action)}
          >
            {action}
          </button>
        ))}

      </div>

      <main>
        {
          selected === ACTIONS.CONV_BASE && <>
            <p>
              <label>Hex</label>
              <input value={inpHex} onChange={(e)=>handleChangeConvBase("Hex",filterHex(e.target.value))} type="text" />
            </p>
            <p>
              <label>Dec</label>
              <input value={inpDec} onChange={(e)=>handleChangeConvBase("Dec",filterDecimal(e.target.value))} type="text" />
            </p>
            <p>
              <label>Bin</label>
              <input value={inpBin} onChange={(e)=>handleChangeConvBase("Bin",filterBinary(e.target.value))} type="text" />
            </p>
            <p className="loader">
              <button className="a" onClick={()=>handleLoadRegister("a",inpBin)}>Load to A</button>
              <button className="b" onClick={()=>handleLoadRegister("b",inpBin)}>Load to B</button>
            </p>
          </>
        }
        {
          selected === ACTIONS.CONV_UNITS && <>
            <input type="text" value={inpUnitValue} onChange={e=>setInpUnitValue(e.target.value)}/>
          </>
        }
        {
          selected === ACTIONS.TWO_OP && <>
            <p>
              <label>Operation</label>
              <select className="button" onChange={(e)=>setTwoOpOperation(e.target.value)} value={twoOpOperation}>
                {TWO_OPS.map((op, i) => (
                  <option key={i} value={op}>{op}</option>
                ))}
                
              </select>
              <button className="button" onClick={handleCalcTwoOp}>=</button>
            </p>
            <p className="result">
              <label>Result</label>
              <input type="text" value={twoOpResult} readOnly />
            </p>
            <p className="loader">
              <button className="a" onClick={() => handleLoadRegister("a", twoOpResult)}>Load A</button>
              <button className="b" onClick={() => handleLoadRegister("b", twoOpResult)}>Load B</button>
            </p>
          
          </>
        }
        {
          selected === ACTIONS.ONE_OP && <>

          </>
        }
        {
          selected === ACTIONS.LOG_BASE && <>
            <p>
              (2<sup>n</sup>)
              n=
              <input type="text" value={inpExp} onChange={(e)=>setInpExp(filterDecimal(e.target.value))}/>
              <span>{resultExp}</span>
            </p>
            <p>
              (log <sub>2</sub>n )
              <input type="text" value={inpLog} onChange={(e)=>setInpLog(filterDecimal(e.target.value))}/>
              <span>{resultLog}</span>
            </p>
          </>
        }
      </main>
    </div>
  );
}



function filterText(allowedChars, text) {
  return [...text].filter(c => allowedChars.includes(c)).join('')
}

function filterBinary(inp) {
  return filterText('10', inp)
}

function filterDecimal(inp) {
  return filterText('0123456789', inp)
}

function filterHex(inp) {
  return filterText('0123456789ABCDEFabcdef', inp).toUpperCase()
}


// UNITS
function convertBits(valueInBits, targetUnit) {
  return valueInBits / UNIT_FACTORS[targetUnit]
}

function convertFromUnit(value, unit) {
  return value * UNIT_FACTORS[unit]
}
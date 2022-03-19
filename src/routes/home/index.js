import Codearea from '../../components/codearea';
import style from './style.css';
import { useRef, useState } from 'preact/hooks'
import Button from '../../components/button';

const api_url = 'http://0.0.0.0:3000'

const uploadTextfile = async (body, ext) => {
  return fetch(`${api_url}/files?name=random&ext=${ext}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  }).then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(`server: ${data.error}`);
      if (typeof data.path !== 'string') throw new Error(`invalid data.path`);
      return data.path
    })
}
const customTest = async (code, input, lang) => {
  try {
    const res = await fetch(api_url);
    if (res.statusText != 'OK') throw new Error('api not avaliable');

    const srcPath = await uploadTextfile(code, lang.ext);
    const inputPath = await uploadTextfile(input, 'in');

    console.log(srcPath, inputPath)

    return await fetch(`${api_url}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "JudgeService.CustomTest",
        params: [
          { src: srcPath, input: inputPath }
        ],
        id: 1
      }),
    }).then(res => res.json())
  } catch (e) {
    console.error(e);
    console.log('it seems that something went wrong...')
  }
}

const langs = [
  { title: 'C', ext: 'c', },
  { title: 'C++', ext: 'cpp', },
]
const resultName = {
  0: "ok",
  1: "re",
  2: "mle",
  3: "tle",
  4: "ole",
  5: "se",
  6: "dsc",
  7: "ece",
}

const Home = () => {
  const [code, setCode] = useState('');
  const [inputText, setInputText] = useState('');
  const [way, setWay] = useState('text');
  const [lang, setLang] = useState('C++');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  return (
    <div className={style.container}>
      <div className={style.home}>
        <h1>Yaoj Custom Test</h1>

        <h3>Source</h3>

        <p>
          <label for="code-lang">Select Language:</label>
          <select
            id="code-lang"
            value={lang}
            onChange={event => {
              setLang(event.target.value)
            }}
          >
            {langs.map(data => <option key={data.title} value={data.title}>{data.title}</option>)}
          </select>
        </p>

        <Codearea content={code} onChange={setCode} />

        <h3>Input</h3>

        <p>
          <select
            value={way}
            onChange={event => {
              setWay(event.target.value)
            }}
          >
            <option value="file">File</option>
            <option value="text">Text Input</option>
          </select>
        </p>

        <p>
          {way === 'file' ? <input type="file" name="filename" ref={fileInputRef} />
            : <Codearea content={inputText} onChange={setInputText} />}
        </p>

        <Button
          name="SUBMIT"
          onClick={() => {
            const langdata = langs.find(data => data.title === lang);
            let inputObj;
            if (way === 'text') {
              inputObj = inputText;
            } else if (way === 'file') {
              if (fileInputRef.current.files.length == 0) {
                console.error('no file specified');
                return;
              }
              inputObj = fileInputRef.current.files[0];
            } else {
              console.error('invalid way');
              return;
            }
            setResult(null)
            customTest(code, inputObj, langdata)
              .then(data => {
                console.log(data)
                setResult(data.result)
              })
          }}
        />
        {result && (<>
          <h3>Result</h3>
          <p>Status: {String(result.compile_error ? 'ce' : resultName[result.result]).toUpperCase()}</p>
          <p>CPU Time: {result.cpu_time / 1000} s</p>
          <p>Real Time: {result.real_time / 1000} s</p>
          <p>Memory: {result.memory / 1e6} MB</p>
          <p>Output: </p>
          <pre><code>{result.stdout}</code></pre>
          <p>Compilation Information: </p>
          <pre><code>{result.compiler_output}</code></pre>
        </>)}
      </div>
    </div >
  )
}

export default Home;

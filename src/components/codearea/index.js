import style from "./style.css";
import { useEffect, useRef, useState } from "preact/hooks";

const Codearea = ({
  content, // string
  onChange, // (string) => void
  ...restProps
}) => {
  const textAreaRef = useRef(null);
  const [height, setHeight] = useState(0);
  const marginBottom = 10;

  useEffect(() => {
    if (height) {
    }
  }, [height]);

  return (
    <textarea
      onInput={(event) => {
        onChange(event.target.value);
        const currentHeight = textAreaRef.current.scrollHeight;
        console.log("key down", currentHeight);
        if (currentHeight > height + marginBottom) {
          setHeight(textAreaRef.current.scrollHeight);
        }
      }}
      className={style.codearea}
      style={{
        height: height == 0 ? "auto" : height + marginBottom,
      }}
      ref={textAreaRef}
      value={content}
      {...restProps}
    />
  );
};

export default Codearea;

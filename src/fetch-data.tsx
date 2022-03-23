import React, { useEffect } from "react";

export const FetchData: React.FC<{ name: string }> = (props) => {
  const [data, setData] = React.useState<string>("");
  useEffect(() => {
    void (async () => {
      const response = await fetch(
        `http://localhost:3001/data?name=${props.name}`
      );
      if (response.ok) {
        setData(await response.text());
      }
    })();
  }, [props.name]);
  return <div style={{ width: "300px", height: "200px" }}>{data}</div>;
};

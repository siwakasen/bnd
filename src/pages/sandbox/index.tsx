import { FC, useState } from "react";
import SandBoxIframe from "../../components/iframe/sanbox/sandbox.iframe";

const SandboxPage: FC = () => {
  const [url, setUrl] = useState("https://codesandbox.io/s/new");
  const [sandboxUrl, setSandboxUrl] = useState("https://codesandbox.io/s/new");
  return (
    <div className="min-h-screen h-screen w-full bg-gray-200">
      <div className="h-full w-full flex flex-col p-4">
        <div className="flex-none">
          <h1 className="text-2xl font-bold text-center mb-4">Sandbox</h1>
          <div className="flex justify-center mt-4">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (url.length > 0) {
                    setSandboxUrl(url);
                  } else {
                    setSandboxUrl("https://codesandbox.io/s/new");
                    setUrl("https://codesandbox.io/s/new");
                  }
                }
              }}
              className="border border-gray-300 rounded-lg p-2 w-1/2"
              placeholder="Enter sandbox URL"
            />
          </div>
        </div>
        <div className="flex-grow">
          <SandBoxIframe url={sandboxUrl} />
        </div>
      </div>
    </div>
  );
};
export default SandboxPage;

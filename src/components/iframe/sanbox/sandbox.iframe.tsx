interface SandBoxIframeProps {
  url: string;
}
const SandBoxIframe: React.FC<SandBoxIframeProps> = ({
  url,
}: SandBoxIframeProps) => {
  return (
    <>
      <div className="p-6 min-h-full h-full bg-gray-200">
        <iframe
          src={url}
          title="CodeSandbox"
          className="w-full h-full  rounded-lg"
        />
      </div>
    </>
  );
};

export default SandBoxIframe;

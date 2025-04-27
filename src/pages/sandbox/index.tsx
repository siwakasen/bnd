import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SandBoxIframe from "../../components/iframe/sanbox/sandbox.iframe";

type DeviceType = "mobile" | "tablet" | "desktop" | "laptop";
type OrientationType = "portrait" | "landscape";

interface Dimensions {
  width: number;
  height: number;
}

const deviceSizes: Record<DeviceType, Dimensions> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
};

export default function ResponsiveTester() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [orientation, setOrientation] = useState<OrientationType>("portrait");
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 700,
    height: 800,
  });
  const [scale, setScale] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // refs for drag
  const isDragging = useRef<boolean>(false);
  const dragDir = useRef<"horizontal" | "vertical" | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setDimensions({
        width: window.innerWidth - 64,
        height: window.innerHeight * 0.8,
      });
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const availW = window.innerWidth * 0.9;
      const availH = window.innerHeight * 0.8;
      const s = Math.min(
        1,
        availW / dimensions.width,
        availH / dimensions.height
      );
      setScale(s);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [dimensions]);

  const updateDimensions = (dev: DeviceType, ori: OrientationType) => {
    const base = deviceSizes[dev];
    setDimensions(
      ori === "portrait"
        ? { width: base.width, height: base.height }
        : { width: base.height, height: base.width }
    );
  };

  const handleChangeDevice = (dev: DeviceType) => {
    setDevice(dev);
    updateDimensions(dev, orientation);
    setMenuOpen(false);
  };

  const handleRotate = () => {
    const newOri: OrientationType =
      orientation === "portrait" ? "landscape" : "portrait";
    setOrientation(newOri);
    updateDimensions(device, newOri);
  };

  // drag start
  const startDragging =
    (direction: "horizontal" | "vertical") => (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      dragDir.current = direction;
      document.addEventListener("mousemove", duringDragging);
      document.addEventListener("mouseup", stopDragging);
    };

  const duringDragging = (e: MouseEvent) => {
    if (!isDragging.current || !dragDir.current) return;
    setDimensions((prev) => {
      let { width, height } = prev;
      if (dragDir.current === "horizontal") {
        width = Math.max(300, width + e.movementX / scale);
      } else {
        height = Math.max(300, height + e.movementY / scale);
      }
      return { width, height };
    });
  };

  const stopDragging = () => {
    isDragging.current = false;
    dragDir.current = null;
    document.removeEventListener("mousemove", duringDragging);
    document.removeEventListener("mouseup", stopDragging);
  };

  // animation variants
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen gap-6">
      <div className="text-sm text-gray-600">
        Container: {Math.round(dimensions.width)}px ×{" "}
        {Math.round(dimensions.height)}px
        <div className="p-">
          <p className="text-gray-700">
            Testing responsive <strong>{device}</strong> dalam mode{" "}
            <strong>{orientation}</strong>
          </p>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          className="relative bg-gray-100 border border-gray-300 overflow-hidden transition-all duration-300"
          style={{
            width: dimensions.width * scale,
            height: dimensions.height * scale,
          }}
        >
          <div
            className="origin-top-left"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              transform: `scale(${scale})`,
            }}
          >
            <div className="w-full h-full bg-white overflow-auto p-4 ">
              <SandBoxIframe url="https://user.cashtrack.my.id" />
            </div>
          </div>

          {/* Horizontal drag handle (kanan) */}
          <div
            onMouseDown={startDragging("horizontal")}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-10 bg-blue-500 cursor-ew-resize"
            title="Resize width"
          />

          {/* Vertical drag handle (bawah) */}
          <div
            onMouseDown={startDragging("vertical")}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-blue-500 cursor-ns-resize"
            title="Resize height"
          />
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col items-end">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              transition={{ duration: 0.2 }}
              className="mb-2 flex flex-col space-y-2"
            >
              <button
                onClick={() => handleChangeDevice("mobile")}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Mobile
              </button>
              <button
                onClick={() => handleChangeDevice("tablet")}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                Tablet
              </button>
              <button
                onClick={() => handleChangeDevice("laptop")}
                className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
              >
                Laptop
              </button>
              <button
                onClick={() => handleChangeDevice("desktop")}
                className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
              >
                Desktop
              </button>
              <button
                onClick={handleRotate}
                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800"
              >
                Rotate
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none"
          title="Menu"
        >
          {menuOpen ? (
            <span className="text-3xl leading-none">×</span>
          ) : (
            <span className="text-3xl leading-none">+</span>
          )}
        </button>
      </div>
    </div>
  );
}

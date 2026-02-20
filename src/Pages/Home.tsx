import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";

const Home = () => {
  const navigate = useNavigate();

  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === "function";

  const handleStart = () => {
    if (!isSupported) {
      return;
    }
    navigate("/screen-test");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Screen Share Test
          </h1>
          <p className="text-gray-600">
            Test your browser's screen sharing capabilities with live preview
            and metadata.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Error Alert */}
          {!isSupported && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-900 font-medium text-sm">
                Your browser is not supported. Please use Chrome or Edge on
                desktop.
              </p>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            Click below to start a screen sharing session. You'll be able to
            select which tab, window, or entire screen to share. The app will
            display a live preview along with stream metadata like resolution,
            frame rate, and display type.
          </p>

          {/* Button */}
          <Button onClick={handleStart} size="lg" disabled={!isSupported}>
            Start Screen Test
          </Button>

          {/* Footer */}
          <p className="text-gray-500 text-xs mt-6 text-center">
            Uses native browser getDisplayMedia API • Chrome & Edge
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

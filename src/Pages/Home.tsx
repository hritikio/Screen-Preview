import Button from '../Components/Button'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const isSupported = typeof navigator !=='undefined' && !!navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia ==='function';
    

    const handleStart=()=>{
      if(!isSupported){
        return 
      }
      navigate("/screen-test");
    }


   
    
 
      return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Screen Share Test App</h1>

        {!isSupported ? (
          <p className="text-red-600">
            Your browser does not support screen sharing.
            <br />
            Please use Chrome or Edge on desktop.
          </p>
        ):(
          <p className="text-green-600">
            Click the button below to start the screen sharing test.
          </p>
        )}

        <Button onClick={handleStart} size='lg' disabled={!isSupported}>
          Start Screen Test
        </Button>
      </div>
    </div>
  );
 
  }

export default Home
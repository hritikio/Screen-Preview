import React from 'react'
import Button from '../Components/Button'

const Home = () => {
  return (
    <>
      {" "}
      <div>Home</div>
      <Button onClick={() => console.log("Button clicked!")} disabled={false} children='hii' size="lg" />
    </>
  );
}

export default Home
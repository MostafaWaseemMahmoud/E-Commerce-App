import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage, useGLTF } from "@react-three/drei";
import { useState } from "react";

export default function ResponsiveModule() {
  const [instance, setInstance] = useState("instance1");

  function BlackModel(props) {
    const { scene } = useGLTF('../../../public/iphone1.glb');
    return <primitive object={scene} {...props} />;
  }
  
  function BlueModel(props) {
    const { scene } = useGLTF('../../../public/iphone.glb');
    return <primitive object={scene} {...props} />;
  }


  return (
    <div
      className="Module"
      style={{
        textAlign: "center",
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
        shadows
        camera={{ fov: 50 }}
        style={{
          width: "90%",
          maxWidth: "600px",
          height: "auto",
          aspectRatio: "6/5",
        }}
      >
        <color attach="background" args={["#F1F5F9"]} />
        <PresentationControls speed={1.5} global zoom={0.5}>
          <Stage environment="studio">
            {instance === "instance1" ? (
              <BlueModel scale={0.01} />
            ) : (
              <BlackModel scale={0.01} />
            )}
          </Stage>
        </PresentationControls>
      </Canvas>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Iphone 15 Pro In Natural Titanium</p>
        <div
          style={{
            marginTop: "20px",
            background: "#dfcecea3",
            width: "122px",
            padding: "13px",
            display: "flex",
            alignItems: "center",
            border: "solid 2px gray",
            justifyContent: "center",
            borderRadius: "47px",
          }}
        >
          <button
            style={{
              background: "white",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "solid 2px gray",
              marginLeft: "5px",
            }}
            onClick={() => setInstance("instance1")}
          ></button>
          <button
            style={{
              background: "black",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "solid 2px gray",
              marginLeft: "5px",
            }}
            onClick={() => setInstance("instance2")}
          ></button>
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            .Module {
              margin-top: 30px;
            }
          }
        `}
      </style>
    </div>
  );
}

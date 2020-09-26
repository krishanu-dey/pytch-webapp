import React, { useEffect, useRef } from "react";
import { BrowserKeyboard } from "../skulpt-connection/browser-keyboard";
import { BrowserMouse } from "../skulpt-connection/browser-mouse";
import { ProjectEngine } from "../skulpt-connection/drive-project";
import { useStoreState } from "../store";
import { stageWidth, stageHeight } from "../constants";

declare var Sk: any;

const Stage = () => {
  console.log("rendering Stage");

  // The build sequence number doesn't actually appear anywhere in
  // the rendered component, but depending on it causes a re-render
  // and a re-set-up of the mouse/keyboard/engine when there's a new
  // Sk.pytch.current_live_project.
  const buildSeqnum = useStoreState((state) => state.activeProject.buildSeqnum);

  const canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  const bubblesRef: React.RefObject<HTMLDivElement> = React.createRef();

  const browserKeyboardRef = useRef<BrowserKeyboard | null>(null);
  const browserMouseRef = useRef<BrowserMouse | null>(null);
  const projectEngineRef = useRef<ProjectEngine | null>(null);

  useEffect(() => {
    console.log("Stage effect: setting up keyboard/mouse/engine", buildSeqnum);
    if (canvasRef.current == null) {
      throw Error("Stage effect: canvasRef is null");
    }
    if (bubblesRef.current == null) {
      throw Error("Stage effect: bubblesRef is null");
    }

    const canvas = canvasRef.current;
    canvas.tabIndex = -1;
    canvas.focus();

    const bubblesDiv = bubblesRef.current;

    // All these ctors also "activate" the new object.
    browserKeyboardRef.current = new BrowserKeyboard(canvas);
    browserMouseRef.current = new BrowserMouse(canvas);
    projectEngineRef.current = new ProjectEngine(canvas, bubblesDiv);

    return () => {
      console.log("Stage effect: tearing down keyboard/mouse/engine");
      browserKeyboardRef.current!.deactivate();
      browserMouseRef.current!.deactivate();
      projectEngineRef.current!.requestHalt();
    };
  });

  return (
    <div id="pytch-stage-layers">
      <canvas
        ref={canvasRef}
        id="pytch-canvas"
        width={stageWidth}
        height={stageHeight}
      />
      <div ref={bubblesRef} id="pytch-speech-bubbles" />
    </div>
  );
};

export default Stage;

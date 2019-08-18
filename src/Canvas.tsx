import React, { useRef, useLayoutEffect, useState } from "react";
// @ts-ignore
import useDimensions from "react-use-dimensions";
import { SCanvas, Sketch } from "solandra";

type CanvasProps = {
  sketch: Sketch;
  aspectRatio?: number;
  seed: number;
  playing?: boolean;
  onClick?: (position: [number, number], size: [number, number]) => void;
};

class CanvasPainterService {
  ctx?: CanvasRenderingContext2D;
  canvas?: HTMLCanvasElement;
  sketch?: Sketch;
  seed = 0;
  playing = false;
  time: number;
  width = 100;
  height = 100;
  aspectRatio = 100;
  af: number | null = null;

  constructor() {
    this.time = 0;
  }

  configure({
    width,
    height,
    aspectRatio,
    sketch,
    seed,
    playing
  }: {
    width: number;
    height: number;
    aspectRatio: number;
    sketch: Sketch;
    seed: number;
    playing: boolean;
  }) {
    if (width && height) {
      if (width / height > aspectRatio) {
        this.height = height;
        this.width = this.height * aspectRatio;
      } else {
        this.width = width;
        this.height = this.width / aspectRatio;
      }
    }

    this.sketch = sketch;
    this.seed = seed;
    this.playing = playing;

    this.canvas!.height = this.height;
    this.canvas!.width = this.width;
    this.af && cancelAnimationFrame(this.af);
    this.updateTime();
  }

  updateTime = () => {
    if (this.playing) {
      this.time += 0.01666666666;
      this.af = requestAnimationFrame(this.updateTime);
    }
    this.draw();
  };

  draw = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const pts = new SCanvas(
        this.ctx,
        {
          width: this.width,
          height: this.height
        },
        this.seed,
        this.time
      );
      this.sketch && this.sketch(pts);
    }
  };
}

export function Canvas({
  aspectRatio,
  sketch,
  seed,
  playing = false,
  onClick = () => {}
}: CanvasProps) {
  const [ref, { width, height }] = useDimensions();
  const canvasRef = useRef(null);
  // seems to be way more performant to re-use context
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [painterRef] = useState(new CanvasPainterService());

  useLayoutEffect(() => {
    let ctx;
    if (!ctxRef.current) {
      const cvs = canvasRef.current;
      if (cvs) {
        ctx = (cvs as HTMLCanvasElement).getContext("2d");
        painterRef.canvas = cvs;
      }
    } else {
      ctx = ctxRef.current;
    }

    painterRef.ctx = ctx;
    painterRef.configure({
      width,
      height,
      aspectRatio: aspectRatio || width / height,
      sketch,
      seed,
      playing
    });
  }, [playing, seed, sketch, aspectRatio, width, height]);

  return (
    <div
      style={{
        flex: 1,
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
      ref={ref}
      onClick={(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { top, left } = canvasRef.current.getBoundingClientRect();
        const x = evt.clientX - left;
        const y = evt.clientY - top;
        onClick([x, y], [width, height]);
      }}
    >
      <canvas id="myCanvas" ref={canvasRef} />
    </div>
  );
}

export function FullScreenCanvas(props: CanvasProps & { zIndex?: number }) {
  const { zIndex = 1000, ...others } = props;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Canvas {...others} />
    </div>
  );
}

export function FixedSizeCanvas(
  props: CanvasProps & { width: number; height: number }
) {
  const { width, height = 1000, ...others } = props;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Canvas {...others} />
    </div>
  );
}

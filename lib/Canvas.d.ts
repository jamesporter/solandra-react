/// <reference types="react" />
import { Sketch } from "solandra";
declare type CanvasProps = {
    sketch: Sketch;
    aspectRatio?: number;
    seed: number;
    playing?: boolean;
    onClick?: (position: [number, number], size: [number, number]) => void;
};
export declare function Canvas({ aspectRatio, sketch, seed, playing, onClick }: CanvasProps): JSX.Element;
export declare function FullScreenCanvas(props: CanvasProps & {
    zIndex?: number;
}): JSX.Element;
export declare function FixedSizeCanvas(props: CanvasProps & {
    width: number;
    height: number;
}): JSX.Element;
export {};

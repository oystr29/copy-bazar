import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Coin = (props: SvgProps) => (
  <Svg
    {...props}
    width={props.width ?? 30}
    height={props.height ?? 30}
    fill="none"
  >
    <Path
      stroke="#056708"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.25 17.5c0 2.071 3.357 3.75 7.5 3.75 4.142 0 7.5-1.679 7.5-3.75 0-2.071-3.358-3.75-7.5-3.75-4.143 0-7.5 1.679-7.5 3.75Z"
    />
    <Path
      stroke="#056708"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.25 17.5v5c0 2.07 3.357 3.75 7.5 3.75 4.142 0 7.5-1.68 7.5-3.75v-5m-22.5-10c0 1.34 1.43 2.578 3.75 3.248 2.32.67 5.18.67 7.5 0 2.32-.67 3.75-1.908 3.75-3.248 0-1.34-1.43-2.577-3.75-3.247-2.32-.67-5.18-.67-7.5 0-2.32.67-3.75 1.907-3.75 3.247Z"
    />
    <Path
      stroke="#056708"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.75 7.5V20c0 1.11.965 1.813 2.5 2.5"
    />
    <Path
      stroke="#056708"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.75 13.75c0 1.11.965 1.813 2.5 2.5"
    />
  </Svg>
);
export { Coin };

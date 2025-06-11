import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const History = (props: SvgProps) => (
  <Svg width={30} height={30} fill="none" {...props}>
    <Path
      stroke="#00670B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M26.25 15V5.625a1.875 1.875 0 0 0-1.875-1.875H5.625A1.875 1.875 0 0 0 3.75 5.625v18.75a1.875 1.875 0 0 0 1.875 1.875H15"
    />
    <Path
      stroke="#00670B"
      strokeWidth={2}
      d="M20 23.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
    />
    <Path
      stroke="#00670B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M23.125 22.5 26.25 25M8.75 10h12.5m-12.5 5h5"
    />
  </Svg>
);
export { History };

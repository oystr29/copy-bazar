import Svg, { Circle as Cir, SvgProps } from "react-native-svg";

export const Circle1 = (props: SvgProps) => {
  return (
    <Svg {...props} width={211} height={165} fill="none">
      <Cir cx={61} cy={15} r={150} fill="#69A46B" fillOpacity={0.6} />
    </Svg>
  );
};

export const Circle2 = (props: SvgProps) => (
  <Svg {...props} width={393} height={276} fill="none">
    <Cir cx={78} cy={-39} r={315} fill="#C0D9C1" fillOpacity={0.25} />
  </Svg>
);

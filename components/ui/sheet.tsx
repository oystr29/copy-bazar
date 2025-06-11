import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import * as React from "react";

const Sheet = React.forwardRef<
  BottomSheetModal,
  React.ComponentPropsWithoutRef<typeof BottomSheetModal>
>(
  (
    { index = 0, backgroundStyle, style, handleIndicatorStyle, ...props },
    ref,
  ) => {
    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      ),
      [],
    );
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        style={
          style ?? {
            borderWidth: 1,
            // borderColor: colors.grey5,
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
          }
        }
        backdropComponent={renderBackdrop}
        {...props}
      />
    );
  },
);

Sheet.displayName = "Sheet";

function useSheetRef() {
  return React.useRef<BottomSheetModal>(null);
}

export { Sheet, useSheetRef };

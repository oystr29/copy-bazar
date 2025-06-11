import { Platform } from "react-native";
import { Toaster as ToasterNative, toast as toastNative } from "sonner-native";
import { Toaster as ToasterWeb, toast as toastWeb } from "sonner";

const Toaster = Platform.OS === "web" ? ToasterWeb : ToasterNative;
const toast = Platform.OS === "web" ? toastWeb : toastNative;

export { Toaster, toast };

import { sensitiveData } from "./src/constants/Sensitive/sensitiveData";

export const Mode = {
  PROD: "PROD",
  DEV: "DEV",
};

export const config = {
  mode: Mode.DEV,

  //Development
  devUrl: sensitiveData.devApiUrl,
  devFileurl: sensitiveData.devFileUrl,

  // Production
  prodUrl: sensitiveData.devApiUrl,
  prodFileUrl: sensitiveData.devFileUrl,

  //Stripe Dev Key
  devStripeKey: "",

  //Stripe prod Key
  prodStripeKey: "",

  //GoogleMapKey
  googleMapKey: "",
};

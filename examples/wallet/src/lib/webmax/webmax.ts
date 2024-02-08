import { webmaxWalletClient } from "webmax2/wallet";

// Note: In an environment like NextJS, where SSRs can occur, a little ingenuity is required.
export const webmax = webmaxWalletClient();

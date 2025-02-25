import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import WithdrawalABI from "./abis/Withdrawals.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { getNextSessionId, getSessionId } from "./Session";
import { Withdrawals } from "./types/Withdrawals";

const address = CONFIG.WITHDRAWAL_CONTRACT;

export async function withdrawSFLTransaction({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  tax,
  sfl,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  sfl: number;
  tax: number;
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        WithdrawalABI as AbiItem[],
        address as string
      ) as unknown as Withdrawals
    ).methods
      .withdrawSFL(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        sfl,
        tax
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function withdrawItemsTransaction({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        WithdrawalABI as AbiItem[],
        address as string
      ) as unknown as Withdrawals
    ).methods
      .withdrawItems(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        ids,
        amounts
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function withdrawWearablesTransaction({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  console.log({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    ids,
    amounts,
  });
  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        WithdrawalABI as AbiItem[],
        address as string
      ) as unknown as Withdrawals
    ).methods
      .withdrawWearables(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        ids,
        amounts
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function withdrawBumpkinTransaction({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  bumpkinId,
  wearableIds,
  wearableAmounts,
  tokenUri,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  bumpkinId: number;
  wearableIds: number[];
  wearableAmounts: number[];
  tokenUri: string;
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  console.log({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    bumpkinId,
    wearableIds,
    wearableAmounts,
    tokenUri,
  });
  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        WithdrawalABI as AbiItem[],
        address as string
      ) as unknown as Withdrawals
    ).methods
      .withdrawBumpkin(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        bumpkinId,
        wearableIds,
        wearableAmounts,
        tokenUri
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

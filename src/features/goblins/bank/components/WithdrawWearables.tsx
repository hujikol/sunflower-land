import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GoblinProvider";
import { Wardrobe } from "features/game/types/game";
import { shortAddress } from "lib/utils/shortAddress";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { availableWardrobe } from "features/game/events/landExpansion/equip";

interface Props {
  onWithdraw: (ids: number[], amounts: number[]) => void;
}

export const WithdrawWearables: React.FC<Props> = ({ onWithdraw }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [wardrobe, setWardrobe] = useState<Wardrobe>({});
  const [selected, setSelected] = useState<Wardrobe>({});

  useEffect(() => {
    setWardrobe(availableWardrobe(goblinState.context.state));
    setSelected({});
  }, []);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => ITEM_IDS[item]);
    const amounts = getKeys(selected).map((item) => selected[item]) as number[];

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onRemove = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));
  };

  // TODO - Filter out currently equipped items!

  const withdrawableItems = [...new Set([...getKeys(wardrobe)])].sort(
    (a, b) => ITEM_IDS[a] - ITEM_IDS[b]
  );

  const selectedItems = getKeys(selected)
    .filter((item) => !!selected[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  return (
    <>
      <div className="mt-3">
        <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
          <span className="text-xs">
            {
              "Some items cannot be withdrawn. Other items may be restricted when "
            }
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-500"
            >
              {"in use"}
            </a>
            {" or are "}
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-500"
            >
              {"still being built"}
            </a>
            {"."}
          </span>
        </div>
        <h2 className="mb-3">Select items to withdraw</h2>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems
            .filter((name) => !!wardrobe[name])
            .map((itemName) => {
              const gameState = goblinState.context.state;

              // The wardrobe amount that is not placed
              const wardrobeCount = wardrobe[itemName];

              return (
                <Box
                  count={new Decimal(wardrobeCount ?? 0)}
                  key={itemName}
                  onClick={() => onAdd(itemName)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                />
              );
            })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-2">
          <h2 className="">Selected</h2>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              return (
                <Box
                  count={new Decimal(selected[itemName] ?? 0)}
                  key={itemName}
                  onClick={() => onRemove(itemName)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                />
              );
            })}
            {/* Pad with empty boxes */}
            {selectedItems.length < 4 &&
              new Array(4 - selectedItems.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="border-white border-t-2 w-full my-3" />
        <div className="flex items-center mt-2 mb-2  border-white">
          <img src={SUNNYSIDE.icons.player} className="h-8 mr-2" />
          <div>
            <p className="text-sm">Send to your wallet</p>
            <p className="text-sm">
              {shortAddress(wallet.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <span className="text-sm mb-4">
          Once withdrawn, you will be able to view your items on OpenSea.{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/fundamentals/withdrawing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more
          </a>
          .
        </span>
      </div>

      <Button
        className="mt-3"
        onClick={withdraw}
        disabled={selectedItems.length <= 0}
      >
        Withdraw
      </Button>
    </>
  );
};

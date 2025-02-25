import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Bid, GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import {
  AuctionResults,
  MachineInterpreter,
  Auction as IAuction,
} from "features/game/lib/auctionMachine";
import { Auctions } from "./Auctions";
import { Loser } from "./Loser";
import { Winner } from "./Winner";
import { AuctionDetails } from "./AuctionDetails";
import { Pending } from "./Pending";
import { AuctionBid } from "./AuctionBid";
import { DraftBid } from "./DraftBid";
import { Refunded } from "./Refunded";
import { MissingAuction } from "./MissingAuction";
import { TieBreaker } from "./TieBreaker";
import { AuctionsComingSoon } from "./AuctionsComingSoon";

interface Props {
  auctionService: MachineInterpreter;
  gameState: GameState;
  onMint: (id: string) => void;
}
export const AuctioneerContent: React.FC<Props> = ({
  auctionService,
  gameState,
  onMint,
}) => {
  const [auctioneerState, send] = useActor(auctionService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [selectedAuctionId, setSelectedAuctionId] = useState<string>();

  if (auctioneerState.matches("noAccess")) {
    return <AuctionsComingSoon />;
  }

  if (auctioneerState.matches("introduction")) {
    return (
      <>
        <div className="p-2">
          <p className="text-sm mb-2">{`I've travelled far and wide across Sunflower Land in search for exotic treasures to bring to my fellow Bumpkins.`}</p>
          <p className="text-sm mb-2">{`Don't miss one of the Auctions where a swing of my mighty hammer can turn your hard-earned resources into rare, minted marvels!`}</p>
          <a
            href="https://docs.sunflower-land.com/player-guides/auctions"
            className="mx-auto text-xxs underline  pb-2 pt-2"
            target="_blank"
            rel="noreferrer"
          >
            Read more
          </a>
        </div>
        <Button onClick={() => send("CONTINUE")}>Continue</Button>
      </>
    );
  }

  if (auctioneerState.matches("error")) {
    return (
      <div className="p-2">
        <p className="mb-2">Something went wrong!</p>
        <Button onClick={() => auctionService.send("REFRESH")}>Retry</Button>
      </div>
    );
  }

  if (auctioneerState.matches("draftingBid")) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === selectedAuctionId
    ) as IAuction;

    return (
      <DraftBid
        gameState={gameState}
        auction={auction}
        maxTickets={9999999} // TODO
        onBid={(tickets: number) => {
          auctionService.send("BID", { auctionId: auction.auctionId, tickets });
        }}
        onBack={() => auctionService.send("CANCEL")}
      />
    );
  }

  if (auctioneerState.matches("bidding")) {
    return <span className="loading">Placing bid</span>;
  }

  if (auctioneerState.matches("refunded")) {
    return <Refunded />;
  }

  if (auctioneerState.matches("missingAuction")) {
    return <MissingAuction auctionService={auctionService} />;
  }

  if (auctioneerState.matches("bidded")) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === auctioneerState.context.bid?.auctionId
    ) as IAuction;

    return (
      <AuctionBid
        auction={auction}
        auctionService={auctionService}
        bid={auctioneerState.context.bid as Bid}
      />
    );
  }

  if (auctioneerState.matches("checkingResults")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("pending")) {
    return <Pending />;
  }

  if (auctioneerState.matches("loser")) {
    return (
      <Loser
        farmId={authState.context.user.farmId ?? 0}
        auctionService={auctionService}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }

  if (auctioneerState.matches("winner")) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === auctioneerState.context.bid?.auctionId
    ) as IAuction;

    console.log({ auction });

    return (
      <Winner
        onMint={onMint}
        bid={auctioneerState.context.bid as Bid}
        farmId={authState.context.user.farmId ?? 0}
        results={auctioneerState.context.results as AuctionResults}
        auction={auction}
      />
    );
  }
  if (auctioneerState.matches("tiebreaker")) {
    return (
      <TieBreaker
        auctionService={auctionService}
        farmId={authState.context.user.farmId ?? 0}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }

  if (selectedAuctionId) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === selectedAuctionId
    ) as IAuction;

    return (
      <AuctionDetails
        item={auction}
        game={gameState}
        onDraftBid={() => {
          auctionService.send("DRAFT_BID");
        }}
        isUpcomingItem={false}
        onBack={() => setSelectedAuctionId(undefined)}
      />
    );
  }

  return (
    <Auctions
      auctionService={auctionService}
      onSelect={(id) => setSelectedAuctionId(id)}
    />
  );
};

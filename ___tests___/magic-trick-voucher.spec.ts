import { expect, test } from "vitest";
import { Game } from "../src/modules/balatrots/Game";
import { InstanceParams } from "../src/modules/balatrots/struct/InstanceParams";
import { Deck, DeckType } from "../src/modules/balatrots/enum/Deck";
import { Stake, StakeType } from "../src/modules/balatrots/enum/Stake";
import { Voucher } from "../src/modules/balatrots/enum/Voucher";
import { Type } from "../src/modules/balatrots/enum/cards/CardType";
import { Card, PlayingCard } from "../src/modules/balatrots/enum/cards/Card";
import { Tarot } from "../src/modules/balatrots/enum/cards/Tarot";

function makeEngine(): Game {
  const params = new InstanceParams(
    new Deck(DeckType.RED_DECK),
    new Stake(StakeType.WHITE_STAKE),
    false,
    10106
  );
  return new Game("MAGICTRICKTEST", params);
}

test("Magic Trick voucher: shop queue contains real playing cards, not phantom 'The Fool' items", () => {
  const engine = makeEngine();
  engine.activateVoucher(Voucher.MAGIC_TRICK);

  const items = Array.from({ length: 200 }, (_, i) => engine.nextShopItem(1 + (i % 8)));

  const playingCardItems = items.filter((item) => item.type === Type.PLAYING_CARD);

  // With Magic Trick active, playing cards must actually show up in the shop queue.
  expect(playingCardItems.length).toBeGreaterThan(0);

  for (const item of playingCardItems) {
    // Each Playing Card slot must wrap a real standard Card, not the default
    // ShopItem() fallback (Type.TAROT + "The Fool").
    expect(item.item).toBeInstanceOf(Card);
    expect(item.item instanceof Tarot).toBe(false);
    expect(Object.values(PlayingCard)).toContain(item.item.getName());
  }
});

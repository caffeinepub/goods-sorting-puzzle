import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";



actor {
  let bestTimes = Map.empty<Nat, Nat>();
  var firstUnbeatenLevel = 0;
  var collectedCards : [Text] = [];
  var inventory = {
    timeFreezers = 0;
    matchMakers = 0;
    hammers = 0;
  };
  var winStreak = 0;

  public query ({ caller }) func getProgress() : async {
    firstUnbeatenLevel : Nat;
    bestTimes : [(Nat, Nat)];
    collectedCards : [Text];
    inventory : {
      timeFreezers : Nat;
      matchMakers : Nat;
      hammers : Nat;
    };
    winStreak : Nat;
  } {
    {
      firstUnbeatenLevel;
      bestTimes = bestTimes.toArray();
      collectedCards;
      inventory;
      winStreak;
    };
  };

  public shared ({ caller }) func saveProgress(level : Nat, seconds : Nat) : async () {
    if (level > firstUnbeatenLevel) {
      firstUnbeatenLevel := level;
    };

    switch (bestTimes.get(level)) {
      case (null) {
        bestTimes.add(level, seconds);
      };
      case (?existingSeconds) {
        if (seconds < existingSeconds) {
          bestTimes.add(level, seconds);
        };
      };
    };
  };

  public shared ({ caller }) func earnCard(cardId : Text) : async () {
    if (collectedCards.find(func(card) { card == cardId }) == null) {
      collectedCards := [cardId].concat(collectedCards);
    };
  };

  public query ({ caller }) func getCardAlbum() : async [Text] {
    collectedCards;
  };

  public shared ({ caller }) func updateInventory(timeFreezers : Nat, matchMakers : Nat, hammers : Nat) : async () {
    inventory := {
      timeFreezers;
      matchMakers;
      hammers;
    };
  };

  public shared ({ caller }) func updateWinStreak(newStreak : Nat) : async () {
    winStreak := newStreak;
  };

  public shared ({ caller }) func resetWinStreak() : async () {
    winStreak := 0;
  };
};

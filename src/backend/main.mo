import Map "mo:core/Map";
import Array "mo:core/Array";

actor {
  var currentLevel = 0;
  let bestMovesMap = Map.empty<Nat, Nat>();

  public query ({ caller }) func getCurrentLevel() : async Nat {
    currentLevel;
  };

  public shared ({ caller }) func saveProgress(level : Nat, moves : Nat) : async () {
    currentLevel := level;
    switch (bestMovesMap.get(level)) {
      case (null) {
        bestMovesMap.add(level, moves);
      };
      case (?existingMoves) {
        if (moves < existingMoves) {
          bestMovesMap.add(level, moves);
        };
      };
    };
  };

  public query ({ caller }) func getProgress() : async {
    currentLevel : Nat;
    bestMoves : [(Nat, Nat)];
  } {
    {
      currentLevel;
      bestMoves = bestMovesMap.toArray();
    };
  };
};

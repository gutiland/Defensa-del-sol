export function soundForEffect(effect) {
  if (effect.type === "impact") {
    return (
      {
        stone: "stone",
        "big-stone": "heavyStone",
        bottle: "bottle",
        molotov: "fire",
      }[effect.weaponType] || (effect.material === "wood" ? "wood" : "hit")
    );
  }
  if (
    ["stone", "big-stone", "bottle", "molotov", "paintbomb"].includes(
      effect.type,
    )
  )
    return "throw";
  return (
    {
      splash: "splash",
      sound: "sound",
      assembly: "assembly",
      rubble: "remove",
    }[effect.type] || null
  );
}

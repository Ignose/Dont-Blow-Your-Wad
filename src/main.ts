import { Args } from "grimoire-kolmafia";
import { sinceKolmafiaRevision } from "libram";
import { getCurrentCrimboWad, results, WAD_TYPES, WadType } from "./util";
import { visitUrl } from "kolmafia";

export const args = Args.create("Dont_Waste_Your_Wad", "Be good, be kind", {
  all: Args.flag({
    help: "Value all elemental wads.",
    default: false,
  }),
  crimbo: Args.flag({
    help: "Use the current (rotating) Crimbo wad.",
    default: false,
  }),
  wad: Args.string({
    help: "If not using the Crimbo wad, which wad should we value?",
    default: "",
  }),
});

export function main(command?: string): void {
  sinceKolmafiaRevision(28549);
  Args.fill(args, command);

  if (args.help) {
    Args.showHelp(args);
    return;
  }

  let wadTypes: WadType[];

  if (args.all) {
    wadTypes = [...WAD_TYPES];
  } else if (args.crimbo) {
    const html = visitUrl("shop.php?whichshop=crimbo25_sammy");
    const todaysWad = getCurrentCrimboWad(html);
    if (!todaysWad) throw "Could not determine today's Crimbo wad!";
    wadTypes = [todaysWad];
  } else if (args.wad !== "") {
    if (!WAD_TYPES.includes(args.wad as WadType)) {
      throw `Invalid wad type "${args.wad}".`;
    }
    wadTypes = [args.wad as WadType];
  } else {
    throw "You didn't select a wad type!";
  }

  results(wadTypes);
}

import { Game } from "@/types/trpc";
import { EditableGameList } from "@/components/editable-game-list";

interface Props {
  addedGames: Game[];
}

export function GamesSummary({ addedGames }: Props) {
  return (
    <div className="flex flex-col gap-8 px-4 lg:px-6">
      <section>
        <h2 className="pb-4 text-xl font-medium tracking-tight">
          Recently added
        </h2>
        <EditableGameList games={addedGames} />
      </section>
    </div>
  );
}

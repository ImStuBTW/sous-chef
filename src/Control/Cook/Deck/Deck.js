import DeckButton from './DeckButton';

import './deck.scss';

import soonIcon from '../../../Icons/soon.png';
import brbIcon from '../../../Icons/toilet_paper.png';
import chefIcon from '../../../Icons/chef.png';
import cuttingBoardIcon from '../../../Icons/knife_and_fork.png';
import stoveIcon from '../../../Icons/cooking.png';
import dontAwooIcon from '../../../Icons/dont_awoo.png';
import prideIcon from '../../../Icons/pride_100.png';
import bowIcon from '../../../Icons/bow.png';
import beersIcon from '../../../Icons/beers.png';
import wolfIcon from '../../../Icons/wolf.png';

function Deck() {
  return (
    <div className="deck">
      <div className="deck-row">
        <DeckButton icon={soonIcon} />
        <DeckButton icon={brbIcon} />
        <DeckButton icon={chefIcon} />
        <DeckButton icon={cuttingBoardIcon} />
        <DeckButton icon={stoveIcon} />
      </div>
      <div className="deck-row">
        <DeckButton icon={dontAwooIcon} />
        <DeckButton icon={prideIcon} />
        <DeckButton icon={bowIcon} />
        <DeckButton icon={beersIcon} />
        <DeckButton icon={wolfIcon} />
      </div>
    </div>
  );
}

export default Deck;

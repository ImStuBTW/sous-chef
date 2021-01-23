// Import React packages.
import { Component } from 'react';

// Include app componnets
import DeckButton from './DeckButton';

// Include component stylings
import './deck.scss';

// Include icon images
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

class Deck extends Component {
  render() {
    return (
      <div className="deck">
        <div className="deck-row">
          <DeckButton 
            socket={this.props.socket} 
            icon={soonIcon}
            command='obs-scene-set'
            argument={{scene: 'Starting Soon'}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={brbIcon}
            command='obs-scene-set'
            argument={{scene: 'Be Right Back'}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={chefIcon}
            command='obs-scene-set'
            argument={{scene: 'Full Kitchen'}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={cuttingBoardIcon}
            command='obs-scene-set'
            argument={{scene: 'Cutting Board'}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={stoveIcon}
            command='obs-scene-set'
            argument={{scene: 'Stove'}}
          />
        </div>
        <div className="deck-row">
          <DeckButton 
            socket={this.props.socket} 
            icon={dontAwooIcon}
            command='obs-send-command'
            argument={{command: 'ToggleMute', params: {source: 'Mic'}}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={prideIcon}
            command='confetti-toggle'
            argument={''}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={bowIcon}
            command='obs-scene-set'
            argument={{scene: 'Thanks for Watching'}}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={beersIcon}
            command='bubbles-toggle'
            argument={''}
          />
          <DeckButton 
            socket={this.props.socket} 
            icon={wolfIcon}
            command='obs-scene-set'
            argument={{scene: 'Pupper'}}
          />
        </div>
      </div>
    );
  }
}

export default Deck;

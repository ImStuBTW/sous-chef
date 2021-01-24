// Import React packages.
import { Component } from 'react';

// Include React-Bootstrap components
import Button from 'react-bootstrap/Button';

// Include component stylings
import './deckButton.scss';

class DeckButton extends Component {
  handleClick = () => {
    console.log('DeckButton.js | handleClick | Emitting \'' + this.props.command + '\' with: ' + this.props.argument);
    this.props.socket.emit(this.props.command, this.props.argument);
  };

  render() {
    return (
      <div className="deck-button-container">
        <div className="deck-button-wrapper">
          <Button
          className="deck-button"
          variant="primary"
          block
          style={{
            backgroundImage: `url(${this.props.icon})`,
            backgroundSize: '80% 80%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
          onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

export default DeckButton;
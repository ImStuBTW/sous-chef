import Button from 'react-bootstrap/Button';

import './deckButton.scss';

function DeckButton(props) {
  return (
    <div className="deck-button-container">
      <div className="deck-button-wrapper">
        <Button
        className="deck-button"
        variant="primary"
        block
        style={{
          backgroundImage: `url(${props.icon})`,
          backgroundSize: '80% 80%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
        />
      </div>
    </div>
  );
}

export default DeckButton;
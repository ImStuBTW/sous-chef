let React = require('react'),
    uuidv1 = require('uuid'),
    Confetti = require('./Confetti.js').default;

class ConfettiWrapper extends React.Component {

    constructor(props) {
        super(props);

        props.socket.on('confetti-state', (msg) => {
            if (msg.state !== 'stop') {
                let confetti = (<Confetti 
                    haltConfetti={msg.state === 'stopping'}
                    confettiOver={() => {
                        console.log("Confetti Over");
                        props.socket.emit('confetti-update', {state: 'stop'});
                        this.setState((state) => {
                            return {
                                confettiFixed: null
                            };
                        });
                    }} 
                />);
                this.setState({
                    confettiFixed: confetti
                });
            }
        });

        props.socket.on('confetti-single', (msg) => {
            let id = uuidv1(),
                amt = (msg && msg.amount && msg.amount < 100) ? msg.amount : 15,
                confetti = (<Confetti 
                    key={id}
                    haltConfetti={true}
                    confettiOver={() => {
                        this.setState((state) => {
                            return {
                                confettiBursts: state.confettiBursts.filter((burst) => burst.id !== id)
                            };
                        });
                    }}
                    burstAmount={amt}
                />);
            this.setState({
                confettiBursts: [...this.state.confettiBursts, {id: id, item: confetti}]
            });
        });
    
        this.state = {
            confettiBursts: [],
            confettiFixed: null
        };
    }

    render() {
        return (<div>
            {this.state.confettiFixed}
            {this.state.confettiBursts.map((burst) => burst.item)}
        </div>);
    }
};

export default ConfettiWrapper;
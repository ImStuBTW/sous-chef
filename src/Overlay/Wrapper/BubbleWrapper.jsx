let React = require('react'),
    uuidv1 = require('uuid'),
    Bubbles = require('./Bubbles.js').default;

class BubbleWrapper extends React.Component {

    constructor(props) {
        super(props);

        props.socket.on('bubbles-state', (msg) => {
            if (msg.state !== 'stop') {
                let bubbles = (<Bubbles 
                    haltBubbles={msg.state === 'stopping'}
                    bubblesOver={() => {
                        props.socket.emit('bubbles-update', {state: 'stop'});
                        this.setState((state) => {
                            return {
                                bubblesFixed: null
                            };
                        });
                    }} 
                />);
                this.setState({
                    bubblesFixed: bubbles
                });
            }
        });

        props.socket.on('bubbles-single', (msg) => {
            let id = uuidv1(),
                amt = (msg && msg.amount && msg.amount < 100) ? msg.amount : 5,
                bubbles = (<Bubbles 
                    key={id}
                    haltBubbles={true}
                    bubblesOver={() => {
                        this.setState((state) => {
                            return {
                                bubbleBursts: state.bubbleBursts.filter((burst) => burst.id !== id)
                            };
                        });
                    }}
                    burstAmount={amt} 
                    showFoam={false}
                />);
            this.setState({
                bubbleBursts: [...this.state.bubbleBursts, {id: id, item: bubbles}]
            });
        });
    
        this.state = {
            bubbleBursts: [],
            bubblesFixed: null
        };
    }

    render() {
        return (<div>
            {this.state.bubblesFixed}
            {this.state.bubbleBursts.map((burst) => burst.item)}
        </div>);
    }
};

export default BubbleWrapper;
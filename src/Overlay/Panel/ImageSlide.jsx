let React = require('react');

class ImageSlide extends React.Component {

	constructor(props) {
		super(props);

        this.boxStyle = {
            position: 'absolute',
            left: '0',
            bottom: '10px'
        }

        this.pinnedImageStyle = {
            'backgroundColor': 'rgba(255,255,255,.75)',
            padding: '5px'
        }

        this.imageBoxStyle = {
            display: 'inline-block',
            position: 'relative',
            width: '210px',
            height: '116px',
            overflow: 'hidden'
        }

        this.imageStyle = {
            left: '0',
            position: 'absolute'
        }

        this.imageTopStyle = Object.assign({}, this.imageStyle,
            {
                'animationName': 'bannerImageSlide',
                'animationTimingFunction': 'ease-in-out',
                'animationIterationCount': 'infinite',
                'animationDuration': '10s',
                'animationDirection': 'alternate'
            });
    
		this.state = {
            leftImageUrl: props.leftImageUrl || '',
            rightImageFirstUrl: props.rightImageFirstUrl || '',
            rightImageSecondUrl: props.rightImageSecondUrl || ''
		};
    }

    render() {
        return (<div style={this.boxStyle}>
            <img src={this.props.leftImageUrl} style={this.pinnedImageStyle} alt="Slide" />
            <div style={this.imageBoxStyle}>
                <img src={this.props.rightImageSecondUrl} style={this.imageStyle} alt="Slide" />
                <img src={this.props.rightImageFirstUrl} style={this.imageTopStyle} alt="Slide" />
            </div>
        </div>);
    }
}

export default ImageSlide;
let React = require('react');

class ImagePanel extends React.Component {
    componentDidMount() {
    }

    render() {
        let wrapperStyle, noTitleStyle, contentGroupStyle, imageStyle;
        if(this.props.rotate === 'cw') {
            wrapperStyle = 'panel-image-wrapper-cw panel-image-wrapper-slide-cw';
            noTitleStyle = 'panel-image-notitle-cw';
            contentGroupStyle = 'panel-image-content-group-cw';
            imageStyle = 'panel-new-image-cw';
        }
        else if(this.props.rotate === 'ccw') {
            wrapperStyle = 'panel-image-wrapper-ccw panel-image-wrapper-slide-ccw';
            noTitleStyle = 'panel-image-notitle-ccw';
            contentGroupStyle = 'panel-image-content-group-ccw';
            imageStyle = 'panel-new-image-ccw';
        }
        else if(this.props.rotate === 'flip') {
            wrapperStyle = 'panel-image-wrapper-flip panel-image-wrapper-slide-flip';
            noTitleStyle = 'panel-image-notitle-flip';
            contentGroupStyle = 'panel-image-content-group-flip';
            imageStyle = 'panel-new-image-flip';
        }
        else {
            wrapperStyle = 'panel-image-wrapper-none panel-image-wrapper-slide-none';
            noTitleStyle = 'panel-image-notitle-none';
            contentGroupStyle = 'panel-image-content-group-none';
            imageStyle = 'panel-new-image-none';
        }

        return (
            <div className={wrapperStyle}>
                <div className={noTitleStyle}>
                    <div className={contentGroupStyle}>
                        <img src={this.props.url} className={imageStyle} alt="Panel" />
                    </div>
                </div>
            </div>
        );
    }
};

export default ImagePanel;
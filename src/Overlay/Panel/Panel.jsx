let React = require('react');

let Sound = require('react-sound').default;

class Panel extends React.Component {

    constructor(props) {
        super(props);

        this.classTypes = {
            panel: props.title ? 'panel' : 'panel-notitle',
            wrapper: 'panel-wrapper',
            header: 'panel-header',
            content: 'panel-content',
            subcontent: 'panel-subcontent',
            slide: 'panel-wrapper-slide',
            image: 'panel-image',
            group: 'panel-content-group',
            dismiss: 'panel-wrapper-peek'
        };
    }

    getDefaultClass(type) {
        let className = this.classTypes[type];

        if (className && this.props.alignment === 'left') {
            className = `${className}-left`;
        }

        return className;
    }

    render() {

        let wrapperClass = this.props.wrapperClass ? this.props.wrapperClass : this.getDefaultClass('wrapper'),
            panelClass = this.getDefaultClass('panel'),
            headerClass = this.props.headerClass ? this.props.headerClass : this.getDefaultClass('header'),
            contentClass = this.props.contentClass ? this.props.contentClass : this.getDefaultClass('content'),
            subcontentClass = 'panel-subcontent',
            content = this.props.children ? this.props.children : this.props.content;

        if (this.props.panelClass) {
            panelClass = this.props.panelClass;
        }
        if (this.props.animate === true) {
            if (this.props.autohide === true) {
                wrapperClass = `${wrapperClass} ${this.getDefaultClass('dismiss')}`;
            }
            else {
                wrapperClass = `${wrapperClass} ${this.getDefaultClass('slide')}`;
            }
        }

        return (<div className={wrapperClass}>
            <div className={panelClass}>
                {this.props.title && <span className={headerClass}>{this.props.title}</span>}
                {this.props.image && <img src={`data:image/png;base64,${this.props.image}`} className={this.getDefaultClass('image')} alt="Pane" />}
                {this.props.sound && <Sound url={this.props.sound} playStatus={Sound.status.PLAYING}/>}
                <div className={this.getDefaultClass('group')}>
                    <p className={contentClass}>{content}</p>
                    {this.props.subcontent && <p className={subcontentClass}>{this.props.subcontent}</p>}
                </div>
            </div>
        </div>);
    }
};

export default Panel;
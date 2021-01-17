const React = require('react'),
    Line = require('react-chartjs-2').Line;

require('chartjs-plugin-streaming');

class TempPanel extends React.Component {
    constructor(props) {
        super(props);

        // Reference to ChartJS Object
        this.chartRef = React.createRef();
    }

    render() {
        return (<div className='panel-wrapper-left'>
            <div className={!this.props.probeAlert ? 'panel-notitle-left panel-chart' : 'panel-notitle-left panel-chart panel-chart-alert'}>
                <div className='panel-content-group-left'>
                    <div className='panel-chart-stats'>
                        <div className={this.props.target === 'No Data' ? 'panel-chart-icon panel-chart-no-target' : 'panel-chart-icon'}>
                            <img className="panel-chart-image" src="/images/Temp.png" alt="Temperature"/>
                        </div>
                        <div className={this.props.target === 'No Data' ? 'panel-chart-temp panel-chart-no-target' : 'panel-chart-temp'}>
                            <div className="panel-chart-f">
                                <div className="panel-chart-text-large">{(parseFloat(this.props.temp).toFixed(1))}</div>
                                <img className="panel-chart-image-large" src="/images/Degree.png" alt="Degree"/>
                                <div className="panel-chart-unit panel-chart-text-large">F</div>
                            </div>
                            <div className="panel-chart-c">
                                <div className="panel-chart-text-small">{((parseFloat(this.props.temp)-32)/1.8).toFixed(1)}</div>
                                <img className="panel-chart-image-small" src="/images/Degree-Gray.png" alt="Degree"/>
                                <div className="panel-chart-unit panel-chart-text-small">C</div>
                            </div>
                        </div>
                        {this.props.target === 'No Data' ? '' : <>
                            <div className="panel-chart-icon">
                                <img className="panel-chart-image" src="/images/Target.png" alt="Target"/>
                            </div>
                            <div className="panel-chart-target">
                                <div className="panel-chart-f">
                                    <div className="panel-chart-text-large">{parseFloat(this.props.target)}</div>
                                    <img className="panel-chart-image-large" src="/images/Degree.png" alt="Degree"/>
                                    <div className="panel-chart-unit panel-chart-text-large">F</div>
                                </div>
                                <div className="panel-chart-c">
                                <div className="panel-chart-text-small">{((parseFloat(this.props.target)-32)/1.8).toFixed(1)}</div>
                                    <img className="panel-chart-image-small" src="/images/Degree-Gray.png" alt="Degree"/>
                                    <div className="panel-chart-unit panel-chart-text-small">C</div>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
                <Line
                    height={200}
                    width={400}
                    ref={this.chartRef}
                    data={this.props.chartData}
                    options={this.props.options}
                />
            </div>
        </div>);
    }
};

export default TempPanel;
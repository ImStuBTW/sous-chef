let React = require('react');

// Import Twitter packages.
let Tweet = require('react-tweet').default;

class TweetPanel extends React.Component {
  render() {
    // Default Styles
    let wrapperStyle = 'panel-image-wrapper-none panel-wrapper-slide-left';
    let noTitleStyle = 'panel-image-notitle-none';
    let contentGroupStyle = 'panel-image-content-group-none';
    let tweetStyle = 'panel-tweet-content'
    // Disable slide-in if there's any media other than an image.
    if(this.props.tweet.extended_entities && this.props.tweet.extended_entities.media[0].type !== 'photo') {
      wrapperStyle = 'panel-image-wrapper-none panel-image-wrapper-slide-none';
      noTitleStyle = 'panel-image-notitle-none';
      contentGroupStyle = 'panel-image-content-group-none';
      tweetStyle = 'panel-tweet-content'
    }

    return (
      <div className={wrapperStyle}>
        <div className={noTitleStyle}>
          <div className={contentGroupStyle}>
            <Tweet className={tweetStyle} data={this.props.tweet} autoPlay={true} />
          </div>
        </div>
      </div>
    );
  }
};

export default TweetPanel;
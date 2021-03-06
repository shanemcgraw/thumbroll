var React = require('react-native');
var PercentageChart = require('./percentageChart');
var HistogramChart = require('./histogramChart');
var NavBar = require('./../../shared/navbar');
var Button = require('./../../shared/button');
// var api = require('../Utils/api');

var {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  Dimensions
} = React;

class FeedbackView extends React.Component {
  constructor(props) {
    super(props);

    var {height, width} = Dimensions.get('window');
    this.state = {
      classId: this.props.route.classId,
      lessonId: this.props.route.lessonId,
      feedbackOption: this.props.route.feedbackOption,
      height: height,
      width: width,
      socket: this.props.route.socket,
      studentThumbsData: {
        data: [],
        average: 0,
        lowest: 0,
        highest: 0
      },
      studentMultiChoiceData: {
        data: [],
        leader: 'N/A'
      }
    };

    this.state.socket.on('studentResponseForTeacher', (studentData) => {
      // MultiChoice case
      if(typeof studentData.answer === 'string') {
        var currentStudentMultiChoiceData = this.state.studentMultiChoiceData.data.slice();
        currentStudentMultiChoiceData.push(studentData.answer);
        
        var calculateLeader = (responses) => {
          var leader = [];
          responses.forEach(() => {
            //do this
          });
          return leader.sort();
        };

        var transformMultiChoiceData = (responses) => {
          var allResponses = {};
          responses.forEach((answer) => {
            allResponses[answer] = allResponses[answer] || 0;
            allResponses[answer]++;
          });
          return [allResponses['A'], allResponses['B'], allResponses['C'], allResponses['D']];
        }

        this.setState({
            studentMultiChoiceData : {
              data : currentStudentMultiChoiceData,
              leader: 'n/a'
            }
          }, () => {
            this.renderChart();
        });
      } else if(typeof studentData.answer === 'number'){
        // Thumbs check case
        var currentStudentThumbsData = this.state.studentThumbsData.data.slice();
        currentStudentThumbsData.push(studentData.answer);
        console.log(this.state.studentThumbsData);
        this.setState({
          studentThumbsData : {
            data : currentStudentThumbsData,
            lowest: currentStudentThumbsData.length ? Math.floor(currentStudentThumbsData.reduce((x,y) => {return x < y ? x : y})) : 0,
            average: currentStudentThumbsData.length ? Math.floor(currentStudentThumbsData.reduce((x,y) => {return x + y}) / currentStudentThumbsData.length) : 0,
            highest: currentStudentThumbsData.length ? Math.floor(currentStudentThumbsData.reduce((x,y) => {return x > y ? x : y})) : 0
          }
          }, () => {
            this.renderChart();
        });
        console.log(this.state.studentThumbsData);
      }
    });
  }

  previousSection() {
    this.state.socket.emit('teacherClosePoll', {lessonId: this.state.lessonId, pollId: this.state.pollId});
    this.state.socket.removeListener('studentResponseForTeacher');
    this.props.navigator.pop();
  }

  beforeLogout() {
    this.state.socket.emit('teacherLoggingOut');
  }

  renderChart() {
    if(this.state.feedbackOption.type == 'thumbs') {
      return (
        <View style={{ width: this.state.width, height: this.state.height * 0.7}}>
          <Text style={styles.responseStatContainer}>Average Response: {this.state.studentThumbsData.average}</Text>
          {React.createElement(PercentageChart, this.state.studentThumbsData)}
        </View>
      )
    } else if(this.state.feedbackOption.type == 'multiChoice') {
      return (
        <View style={{ width: this.state.width, height: this.state.height * 0.7}}>
          <Text style={styles.responseStatContainer}>Number of responses: {this.state.studentMultiChoiceData.data.length}</Text>
          {React.createElement(HistogramChart, this.state.studentMultiChoiceData)}
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <NavBar navi={this.props.navigator} 
          onBack={this.previousSection.bind(this)}
          beforeLogout={this.beforeLogout.bind(this)}>
          {this.state.feedbackOption.name}
        </NavBar>
        <View style={styles.viewContainer}>
          {this.renderChart.call(this)}
          <View style={styles.backButtonContainer}>
            <Button onPress={this.previousSection.bind(this)} style={styles.backButton} text={'Close poll'} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  responseStatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginLeft: 115
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  pageText: {
    fontSize: 20
  },
  chartContainer: {
    backgroundColor: '#fafafa'
  }
});

module.exports = FeedbackView;

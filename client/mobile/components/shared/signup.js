var React = require('react-native');
var Login = require('./login');
var JoinClassView = require('./../student/joinClassView');
var StartClassView = require('./../teacher/startClassView');
var api = require('./../../utils/api');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Picker,
  ActivityIndicatorIOS
} = React;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmedPassword: '',
      accountType: 'student',
      isLoading: false,
      error: false,
      passwordError: false
    };
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }

  handleConfirmedPasswordChange(event) {
    this.setState({
      confirmedPassword: event.nativeEvent.text
    });
  }

  handleSubmit() {
    if (this.state.password === this.state.confirmedPassword) {
      this.setState({
        isLoading: true,
        passwordError: false
      });
      // api.signup(this.state.username, this.state.password, this.state.accountType)
      // .then((response) => {
      //   if(response.status === 500){
      //     this.setState({
      //       error: 'User already exists',
      //       isLoading: false
      //     });
      //   } else {
      //     //keychain stuff?
      //     var body = JSON.parse(response.body);
      //     if(body.type === 'teacher') {
      //       this.props.navigator.push({
      //         component: StartClassView,
      //         classes: body.classes,
      //         sceneConfig: {
      //           ...Navigator.SceneConfigs.FloatFromBottom,
      //           gestures: {}
      //         }
      //       });
      //     } else if (body.type === 'student') {
      //       this.props.navigator.push({
      //         component: JoinClassView,
      //         classes: body.classes,
      //         sceneConfig: {
      //           ...Navigator.SceneConfigs.FloatFromBottom,
      //           gestures: {}
      //         }
      //       });
      //     }
      //   }
      // })
      // .catch((err) => {
      //   this.setState({
      //     error: 'User already exists' + err,
      //     isLoading: false
      //   });
      // }
      //for time being, this is hardcoded:
      this.props.navigator.push({
        component: StartClassView,
        userId: 'aUserId',
        username: this.state.username,
      });
      this.setState({
        isLoading: false,
        error: false,
        username: '',
        password: ''
      });
    } else {
      this.setState({
        error: false,
        passwordError: 'Passwords dont match',
        isLoading: false,
        password: ''
      });
    }
  }

  handleRedirect() {
    this.props.navigator.pop();
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var showPasswordErr = (
      this.state.passwordError ? <Text style={styles.err}> {this.state.passwordError} </Text> : <View></View>
    );
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}> 
        <View style={styles.mainContainer}>
          <Text style={styles.fieldTitle}> Username </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            value={this.state.username}
            returnKeyType={'next'}
            onChange={this.handleUsernameChange.bind(this)}
            onSubmitEditing={(event) => {
              this.refs.SecondInput.focus();
            }} 
          />
          <Text style={styles.fieldTitle}> Password </Text>
          <TextInput
            ref='SecondInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.password}
            returnKeyType={'next'}
            onChange={this.handlePasswordChange.bind(this)}
            onSubmitEditing={(event) => {
              this.refs.ThirdInput.focus();
            }} 
          />
          <Text style={styles.fieldTitle}> Confirm Password </Text>
          <TextInput
            ref='ThirdInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.confirmedPassword}
            returnKeyType={'go'}
            onSubmitEditing={this.handleSubmit.bind(this)}
            onChange={this.handleConfirmedPasswordChange.bind(this)} 
          />
          <Text style={styles.fieldTitle}> Account Type </Text>
          <Picker
            style={styles.picker}
            selectedValue={this.state.accountType}
            onValueChange={(type) => this.setState({accountType: type})}>
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
          </Picker>
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='#e66365'
          >
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='#ededed'
          >
            <Text style={styles.signin}> Already have an account? Sign in! </Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating= {this.state.isLoading}
            size='large'
            style={styles.loading}
          />
          {showErr}
          {showPasswordErr}
        </View>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fieldTitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#616161'
  },
  userInput: {
    height: 50,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#616161',
    borderRadius: 4,
    color: '#616161'
  },
  picker: {
    bottom: 70,
    height: 70
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  signin: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center'
  },
  loading: {
    marginTop: 20
  },
  err: {
    fontSize: 14,
    textAlign: 'center'
  },
});

module.exports = Signup;
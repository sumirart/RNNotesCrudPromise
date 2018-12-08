import React, { Component } from "react";
import { Container, Content, Textarea, Form, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AndroidBackHandler } from 'react-navigation-backhandler'; // handle back button
import { connect } from 'react-redux';

// IMPORT ACTIONS AND MAPDISPATCHTOPROPS
import { editNote } from '../../public/redux/actions/note';
const mapDispatchToProps = dispatch => {
    return {
        editNote: (id, data) => dispatch(editNote(id, data))
    }
}

class EditNoteScreen extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            text: '',
            changed: false
        }
    }

    // SET NAVIGATION TO ACCESS METHOD
    componentDidMount() {
        this.props.navigation.setParams({
            saveNote: this.saveNote
        });
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        const text = navigation.getParam('text');
        this.setState({ id, text })
    }

    // SAVE TO REDUX
    saveNote = () => {
        const text = this.state.text;
        const id = this.state.id;
        const date = Date();

        // if (this.state.text !== '') {
        if (this.state.changed) {
            this.props.editNote(id, { text, date });
            this.props.navigation.pop();
        } else {
            this.props.navigation.pop();
        }
    }

    // CUSTOM BACK BUTTON (ALSO SAVE) ON HEADER
    static navigationOptions = ({ navigation }) => {
        console.log(navigation.getParam('saveNote'));
        return {
            headerLeft: (
                // <Button }>
                    <Icon name="arrow-back" size={25}
                        style={{ margin: 15 }}
                        onPress={() => navigation.getParam('saveNote')()}
                    />
                // </Button>
            )
        }
    }

    // HANDLE WHEN BACK KEY PRESSES
    onBackButtonPressAndroid = () => {
        this.saveNote();
        this.props.navigation.pop();
        return true;
    };

    // GET MONTHS FOR PLACEHOLDER
    showDate = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const today = new Date();
        const thisMonth = months[today.getMonth()];
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        const thisHour = today.getHours();
        const thisMinute = today.getMinutes();
        return `${thisDate} ${thisMonth} ${thisYear} ${thisHour}.${thisMinute}`;
    }

    render() {
        return (
            <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
                <Container>
                    <Content enableAutomaticScroll={false}>
                        <Form>
                            <Textarea
                                autoFocus={true}
                                value={this.state.text}
                                onChangeText={(text) => {
                                    this.setState({ text, changed: true })
                                }}
                                style={{ fontSize: 16, padding: 15, textAlign: "left" }}
                                rowSpan={22}
                            />
                        </Form>
                    </Content>
                </Container>
            </AndroidBackHandler>
        );
    }
}

export default connect(null, mapDispatchToProps)(EditNoteScreen);
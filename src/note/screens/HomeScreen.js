import React, { Component } from 'react';
import { View, ListView, Alert, FlatList } from 'react-native';
import { Container, Content, Button, Icon, List, Header, Title, Left, Body, Right, Text, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios'

// IMPORT COMPONENT AND ACTIONS
// import Note from '../components/Note';
import { toggleGrid } from '../../public/redux/actions/note'
import { removeNotes } from '../../public/redux/actions/note'

const mapStateToProps = state => ({
    notes: state.notes,
    isGrid: state.isGrid
})

const mapDispatchToProps = dispatch => ({
    toggleGrid: () => dispatch(toggleGrid()),
    removeNotes: note => dispatch(removeNotes(note)),
})


// IMPORT COMPONENT
import ListComponent from '../components/ListComponent';
import GridComponent from '../components/GridComponent';


const IP = 'http://192.168.0.13:3000/notes';



class HomeScreen extends Component {
    constructor() {
        super();
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            data: [],
            selectedId: [],
            toggle: false,
            selectNone: false
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.getData();
    }

    componentWillUpdate() {
        this.getData();
    }

    // componentDidUpdate() {
    //     this.getData();
    // }


    // TOGGLE EDIT BUTTON
    toggleEdit = () => {
        if (this.state.toggle === false) {
            this.setState({ toggle: true })
        } else {
            this.setState({ toggle: false, selectedId: [] })
        }
        // this.setState({ toggle: !this.state.toggle })
    }

    // SELECTED ID
    selectId = (id) => {
        const index = this.state.selectedId.indexOf(id);
        if (index === -1) {
            this.setState({ selectedId: [...this.state.selectedId, id] })
        } else {
            this.setState(state => {
                const selectedId = state.selectedId.filter(e => e !== id);
                return {
                    selectedId
                }
            })
        }
    }


    // AXIOS METHOD --------------------
    // GET ALL
    getData = () => {
        axios.get(IP)
            .then((response) => {
                this.setState({ data: response.data });
                // console.log('response GET: ' + response);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // DELETE ALL
    removeAll = () => {
        axios.delete(IP)
            .then(res => {
                // console.log('success delete all: ' + res);
            })
            .catch(err => {
                console.log(err);
            })

        this.setState({ data: [] })
    }

    // DELETE BY ID
    removeNote = (id) => {
        axios.delete(IP + '/' + id)
            .then(res => {
                // console.log('success delete: ' + res);
            })
            .catch(err => {
                console.log(err);
            })
        this.getData();
    }


    // DELETE NOTES
    deleteNote = () => {
        // const self = this.props;
        // If no selected note, delete all
        if (this.state.selectedId.length === 0) {
            this.removeAll();
            this.toggleEdit()
        } else {
            // if there is selected note, delete selected
            this.state.selectedId.map(e => {
                this.removeNote(e);
                // this.props.removeNotes(e);
                this.setState({ selectedId: [], toggle: false, selectNone: true })
            })
        }
    }


    // CLOSE ROW WHEN DELETED
    deleteRow = (secId, rowId, rowMap) => {
        // <<<<<<<<<<<<<<<<<<<<<<<<< CONSOLE LOG LATER FOR FIXs
        rowMap[`${secId}${rowId}`].props.closeRow();
    }

    // CONFIRMATION ALERT ON DELETE ALL/SELECTED
    confirmButton() {
        Alert.alert(
            "Delete Note",
            "Are you sure want to delete note?",
            [
                {
                    text: "NO", onPress: () => {
                        // console.log("Cancel delete");
                    }
                },
                {
                    text: "YES", onPress: () => {
                        // console.log("Confirm delete");
                        this.deleteNote();
                    }
                }
            ],
            { cancelable: false }
        )
    }

    // CONFIRMATION ALERT ON DELETE SINGLE
    confirmButtonSingle(note) {
        Alert.alert(
            "Delete Note",
            "Are you sure want to delete note?",
            [
                {
                    text: "NO", onPress: () => {
                        // console.log("Cancel delete");
                    }
                },
                {
                    text: "YES", onPress: () => {
                        // console.log("Confirm delete");
                        // this.deleteSingleNote(note);
                        this.removeNote(note)
                    }
                }
            ],
            { cancelable: false }
        )
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <Container>
                {/* HEADER------------------------------ */}
                <Header style={{ backgroundColor: "white", marginBottom: 5 }}>
                    <Left />
                    <Body>
                        <Title style={{ color: "black", fontWeight: "bold" }}>
                            {this.state.selectedId.length === 0 ?
                                "Notes" : this.state.selectedId.length + " Selected"
                            }
                        </Title>
                    </Body>
                    <Right>
                        {/* If no notes disabled "Edit" button */}
                        {this.state.data.length < 1 ?
                            (
                                <Button hasText transparent>
                                    <Text style={{ color: "#949494" }}>
                                        Edit
                                    </Text>
                                </Button>

                            ) :
                            // If there is note toggleEdit()
                            (
                                <Button hasText transparent onPress={() => this.toggleEdit()}>
                                    <Text style={{ color: "black" }}>
                                        {this.state.toggle ? "Cancel" : "Edit"}
                                    </Text>
                                </Button>
                            )}
                    </Right>
                </Header>


                {/* CONTAINER------------------------------ */}
                <Content>
                    {this.props.notes.isGrid ?
                        <View style={{ marginHorizontal: 10 }}>
                            <FlatList
                                numColumns={2}
                                data={this.state.data}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item }) => (
                                    <GridComponent
                                        item={item}
                                        selectNone={this.state.selectNone}
                                        toggle={this.state.toggle}
                                        selectId={this.selectId}
                                    />
                                )}
                            />
                        </View>
                        :
                        <List
                            rightOpenValue={-75}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            dataSource={this.ds.cloneWithRows(this.state.data)}
                            renderRow={data =>
                                <List>
                                    <ListComponent
                                        selectNone={this.state.selectNone}
                                        note={data}
                                        toggle={this.state.toggle}
                                        selectId={this.selectId}
                                        style={{ marginLeft: 15 }}
                                    />
                                </List>
                            }
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => {
                                    // console.log(data);
                                    this.confirmButtonSingle(data.id);
                                    this.deleteRow(secId, rowId, rowMap)
                                }}>
                                    <Icon active name="trash" />
                                </Button>}
                        />
                    }
                </Content>


                {/* FOOTER------------------------------ */}
                < Footer >
                    <FooterTab style={{ backgroundColor: "white" }} >
                        <Left>
                            {this.props.notes.isGrid ?
                                (
                                    <Button transparent={true} onPress={() => {
                                        this.props.toggleGrid({})
                                        this.setState({ toggle: false, selectedId: [] })
                                    }}>
                                        <Icon name="list-box" />
                                    </Button>
                                ) :
                                <Button transparent={true} onPress={() => {
                                    this.props.toggleGrid({})
                                    this.setState({ toggle: false, selectedId: [] })
                                }}>
                                    <Icon name="grid" />
                                </Button>
                            }

                        </Left>

                        <Body>
                            <Text style={{ color: "black" }} >
                                {
                                    // Show length() of notes
                                    this.state.data.length
                                }{
                                    // "note" for 0 and 1, "notes" for 2 or more
                                    this.state.data.length < 2 ? " Note" : " Notes"
                                }
                            </Text>
                        </Body>

                        <Right>
                            {/* Toggle Delete or Add */}
                            {this.state.toggle ?
                                (
                                    // Toggle "Delete" or "Delete All"
                                    this.state.selectedId.length == 0 ? (
                                        <Button hasText transparent onPress={
                                            () => {
                                                this.confirmButton();
                                            }
                                        }>
                                            <Text>Delete All</Text>
                                        </Button>
                                    ) :
                                        <Button hasText transparent onPress={
                                            () => {
                                                this.confirmButton();
                                            }
                                        }>
                                            <Text>Delete</Text>
                                        </Button>
                                ) :
                                (
                                    <Button onPress={() => this.props.navigation.navigate("AddNote")} transparent={true}>
                                        <Icon name="add-circle" color="black" />
                                    </Button>
                                )}

                        </Right>
                    </FooterTab>
                </Footer >
            </Container >
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
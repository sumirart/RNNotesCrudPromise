import React, { Component } from 'react';
import { View, ListView, Alert, FlatList } from 'react-native';
import { Container, Content, Button, Icon, List, Header, Title, Left, Body, Right, Text, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';

import { fetch, removeNote, removeAllNotes, toggleGrid } from '../../public/redux/actions/note';


const mapStateToProps = state => ({
    notes: state.notes,
    isGrid: state.isGrid
})

// map dispatch to trigger actions to this.props
const mapDispatchToProps = dispatch => ({
    fetch: () => dispatch(fetch()),
    removeNote: id => dispatch(removeNote(id)),
    removeAllNotes: _ => dispatch(removeAllNotes()),
    toggleGrid: () => dispatch(toggleGrid()),
})


// IMPORT COMPONENT
import ListComponent from '../components/ListComponent';
import GridComponent from '../components/GridComponent';


class HomeScreen extends Component {
    constructor() {
        super();
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            selectedId: [],
            toggle: false,
            selectNone: false,
            refresh: false
        };
    }

    // remove title bar
    static navigationOptions = {
        header: null
    };

    // fetch data at first mount and re-fetch data after going back to Home
    componentDidMount() {
        this.props.fetch();
    }

    shouldComponentUpdate(newProps){
        if(this.props.notes.notes !== newProps.notes.notes){
            this.setState({ refresh: !this.state.refresh })       
            console.log("COMPONENT UPDATED CUY!")
            return true;
        } else { return false }
    }


    // TOGGLE EDIT BUTTON
    toggleEdit = () => {
        if (this.state.toggle === false) {
            this.setState({ toggle: true })
            alert("trueeee")
        } else {
            this.setState({ toggle: false, selectedId: [] })
            alert("false")
        }
    }

    // SELECTED ID, add selected id to state
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

    // DELETE NOTES
    deleteNote = () => {
        // If there is no selected note, delete all
        if (this.state.selectedId.length === 0) {
            this.props.removeAllNotes();
            this.toggleEdit()
        } else {
            // if there is selected note, delete selected
            this.state.selectedId.map(e => {
                this.props.removeNote(e);
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
                        // this.removeNote(note)
                        this.props.removeNote(note)
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
                        {this.props.notes.notes.length < 1 ?
                            (
                                <Button hasText transparent>
                                    <Text style={{ color: "#949494" }}>
                                        Edit
                                    </Text>
                                </Button>

                            ) :
                            // If there is note toggleEdit()
                            (
                                <Button hasText transparent onPress={() => {
                                    this.toggleEdit();
                                    }}>
                                    <Text style={{ color: "black" }}>
                                        {this.state.toggle ? "Cancel" : "Edit"}
                                    </Text>
                                </Button>
                            )}
                    </Right>
                </Header>


                {/* CONTAINER------------------------------ */}
                <Content>
                <Button hasText transparent onPress={() => {
                    this.setState({ refresh: !this.state.refresh })
                    console.log("Refresh pressed!")
                    console.log(this.state.refresh)
                }}>
                                        <Text>Refresh</Text>
                                        </Button>
                    {this.props.notes.isGrid ?
                        <View style={{ marginHorizontal: 10 }}>
                            <FlatList
                                numColumns={2}
                                data={this.props.notes.notes}
                                extraData={this.state}
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
                            dataSource={this.ds.cloneWithRows(this.props.notes.notes)}
                            renderRow={data =>
                                // <List>
                                    <ListComponent
                                        selectNone={this.state.selectNone}
                                        note={data}
                                        toggle={this.state.toggle}
                                        selectId={this.selectId}
                                        style={{ marginLeft: 15 }}
                                    />
                                // </List>
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
                                    this.props.notes.notes.length
                                }{
                                    // "note" for 0 and 1, "notes" for 2 or more
                                    this.props.notes.notes.length < 2 ? " Note" : " Notes"
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
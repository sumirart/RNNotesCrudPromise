import React, { Component } from "react";
import { Col } from 'react-native-easy-grid'
import { Text, CardItem, View } from 'native-base';

class Column extends Component {
    state = {
        checked: false,
        selectNone: this.props.selectNone
    }

    render() {
        return (
            <Col
                style={{ height: 100, marginHorizontal: 5 }}
                onPress={() => {
                    this.props.navigation.navigate("EditNote", {
                        id: this.props.notes[index].id,
                        date: this.props.notes[index].date,
                        text: this.props.notes[index].text
                    })
                }
                }
            >
                <CardItem style={{ flexGrow: 1, flexDirection: "column", borderColor: "#98999b", borderWidth: 1, borderRadius: 5 }}>
                    <Text numberOfLines={1} style={{ flex: 1 }}>
                        {this.props.notes[index].text.split('\n')[0]}
                    </Text>
                    <Text note style={{ flex: 1 }} numberOfLines={1}>
                        {
                            this.props.notes[index].text.split('\n')[1] === undefined ?
                                "No additional text" :
                                this.props.notes[index].text.split('\n')[1]
                        }
                    </Text>
                    <Text note numberOfLines={1} style={{ flex: 1 }}>
                        {this.formatDate(this.props.notes[index].date)}
                    </Text>
                </CardItem>
            </Col>
        );
    }
}
export default Column;
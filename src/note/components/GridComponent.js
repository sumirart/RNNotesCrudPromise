import React, { Component } from "react";
import { View } from 'react-native';
import { Text, Card, CheckBox } from 'native-base';
import { withNavigation } from 'react-navigation';

class GridComponent extends Component {
    state = {
        checked: false,
        selectNone: this.props.selectNone
    }

    // RERENDER PROPS AND SET CHECKED TO FALSE
    componentDidUpdate(prevProps) {
        if (prevProps.toggle === false) {
            if (this.state.checked === true) {
                this.setState({ checked: false })
            }
        }
    }

    // FORMAT DATE
    formatDate = (date) => {
        var date = new Date(date);
        var today = new Date();
        // custom date for check
        // var date = new Date("Sat Nov 24 2018 07:00:00 GMT+0700 (WIB)");

        // check if today
        if (date.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
            return "Today"
        }

        // check if less less than 7 days and return day name
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((today.getTime() - date.getTime()) / (oneDay)));

        if (diffDays < 7) {
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            return weekday[date.getDay()];

        } else {
            // if more than 6 days return format
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yy = date.getFullYear().toString().substr(-2);

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return dd + '/' + mm + '/' + yy;
        }
    }

    render() {
        const item = this.props.item;
        return (
            <Card key={item.id} style={{ width: "49%", heigth: 100, marginHorizontal: 5 }} onPress={() => {
                this.props.navigation.navigate("EditNote", {
                    id: item.id,
                    date: item.date,
                    text: item.text
                })
            }}>
                <View style={{ padding: 5, height: 100, justifyContent: "space-between" }}>
                    <View>
                        <Text numberOfLines={1} style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>{item.text.split('\n')[0]}</Text>
                        <Text numberOfLines={2} style={{ color: "#949494", textAlign: "center" }}>
                            {
                                item.text.split('\n')[1] === undefined ?
                                    "No additional text" :
                                    item.text.split('\n')[1]
                            }
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text numberOfLines={1} style={{ fontSize: 13, color: "#949494", width: "50%" }}>
                            {this.formatDate(item.date)}
                        </Text>
                        {
                            this.props.toggle ?
                                <CheckBox checked={this.state.checked}
                                    style={{ marginRight: 10 }} onPress={
                                        () => {
                                            this.props.selectId(item.id)
                                            this.setState({ checked: !this.state.checked })
                                        }
                                    } />
                                : null
                        }
                    </View>
                </View>
            </Card>
        );
    }
}
export default withNavigation(GridComponent);
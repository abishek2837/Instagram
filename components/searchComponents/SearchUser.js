import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements';
import { db } from '../../Firebase'


const SearchUser = ({ navigation }) => {
    const [users, setUsers] = useState([])
    const fetchUsers = async (text) => {
        text.length > 0 ?
            await db.collection('users')
                .orderBy('userName').startAt(text).endAt(text + "\uf8ff")
                .get().then((docs) => {
                    const userlist = []
                    if (!docs.empty) {
                        docs.forEach(doc => {
                            userlist.push(doc.data())
                        })
                        setUsers(userlist)
                    }
                    else {
                        setUsers([])
                    }

                })
            : setUsers([])
    }
    const handleUserProfileView = (user) => {
        navigation.navigate('SearchedUserView', { currentUser: user })
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar />
            <SearchHeader fetchUsers={fetchUsers} navigation={navigation}/>
            <Divider width={0.1} orientation='vertical' />
            <View>
                {users.length > 0 ?
                    users.map((user, index) => {
                        return (
                            <TouchableOpacity style={styles.userColumn} key={index} onPress={() => handleUserProfileView(user)}>
                                <Image style={styles.usersImage} source={{ uri: user.profilePicture }} />
                                <View>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{user.userName}</Text>
                                    <Text style={{ color: 'grey' }}>{user.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                    : null
                }
            </View>
        </SafeAreaView>
    )
}

const SearchHeader = ({ fetchUsers, navigation }) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Image style={styles.backImage} source={require('../../assets/images/back.png')} />
            </TouchableOpacity>
            <TextInput
                style={styles.searchBox}
                placeholder='Search'
                onChangeText={(text) => fetchUsers(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    headerContainer: {
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    backImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    searchBox: {
        width: '85%',
        height: 35,
        padding: 10,
        backgroundColor: '#c6c6c6',
        borderRadius: 7
    },
    usersImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    userColumn: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        gap: 20,
        marginHorizontal: 20
    }
})

export default SearchUser;


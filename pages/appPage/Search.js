import React, { useState } from 'react'
import {  StyleSheet } from 'react-native'
import { db } from '../../Firebase'
import SearchNavigation from '../navigation/searchNavigaion.js/SearchNavigation';


const Search = ({navigation}) => {
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
    return (
        <SearchNavigation/>
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

export default Search

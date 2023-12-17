import React  from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import PostNavigation from '../navigation/addPostNavigation/PostNavigation'

const AddPost = ({navigation}) => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <PostNavigation externalNavigation={navigation}/>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    }
})

export default AddPost

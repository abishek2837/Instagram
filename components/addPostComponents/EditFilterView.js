import React from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import {
    Grayscale,
    Sepia,
    Tint,
    ColorMatrix,
    concatColorMatrices,
    invert,
    contrast,
    saturate
  } from 'react-native-color-matrix-image-filters'

const EditFilterView = () => {
    const imageurl = useSelector(state => state.addPostReducer.AddPostImage)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <PageHeader />
            <PageIMageView />
            <FliterListView />
        </SafeAreaView>
    )
}

const PageHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity>
                <Image style={styles.headerBackImage} source={require('../../assets/images/back.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.headerNextBtn}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

const PageIMageView = () => {
    return (
        <Image style={styles.pageImageVIew} source={{ uri: 'file:///storage/emulated/0/DCIM/Screenshots/IMG_20230623_105505.jpg' }} />

    )
}

const FliterListView = () => {
    return (
        <ScrollView style={styles.filterListContainer} horizontal={true}>
            <View style={styles.filterList}>
            <Text style={{color:'white'}}>orginal</Text>
            <TouchableOpacity>
            {/* <Grayscale> */}
            <Image style={styles.previewImageList} source={{ uri: 'file:///storage/emulated/0/DCIM/Screenshots/IMG_20230623_105505.jpg' }} />
            {/* </Grayscale> */}
            </TouchableOpacity>
            </View>

            <View style={styles.filterList}>
            <Text style={{color:'white'}}>orginal</Text>
            <TouchableOpacity>
            <Image style={styles.previewImageList} source={{ uri: 'file:///storage/emulated/0/DCIM/Screenshots/IMG_20230623_105505.jpg' }} />
            </TouchableOpacity>
            </View>

            <View style={styles.filterList}>
            <Text style={{color:'white'}}>orginal</Text>
            <TouchableOpacity>
            <Image style={styles.previewImageList} source={{ uri: 'file:///storage/emulated/0/DCIM/Screenshots/IMG_20230623_105505.jpg' }} />
            </TouchableOpacity>
            </View>

            <View style={styles.filterList}>
            <Text style={{color:'white'}}>orginal</Text>
            <TouchableOpacity>
            <Image style={styles.previewImageList} source={{ uri: 'file:///storage/emulated/0/DCIM/Screenshots/IMG_20230623_105505.jpg' }} />
            </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 15
    },
    headerBackImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    headerNextBtn: {
        color: '#2196F3',
        fontSize: 16,
    },
    pageImageVIew: {
        width: '100%',
        height: 350,
        resizeMode: 'contain'
    },
    previewImageList: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    filterListContainer: {
        top: '20%',
        marginHorizontal: 10
    },
    filterList: {
        alignItems: 'center',
        margin: 5
    }
})

export default EditFilterView

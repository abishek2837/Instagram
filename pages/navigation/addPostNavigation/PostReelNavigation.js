import React, {useState} from 'react';
import { useWindowDimensions, Image, StyleSheet, Text, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AddPostContainer from '../../../components/addPostComponents/AddPostContainer';
import AddReelView from '../../../components/addPostComponents/AddReelView';

const PostReelNavigation = ({externalNavigation,navigation}) => {
    const [mode , setMode] = useState('gallery')
    const selectMode = (data) => {
        setMode(data)
    }
    const renderScene = SceneMap({
        AddPostContainer: ()=><AddPostContainer externalNavigation={externalNavigation} selectMode={selectMode} mode={mode} navigation={navigation}/>,
        AddReelView: ()=><AddReelView navigation={navigation} externalNavigation={externalNavigation}/>,
    });
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'AddPostContainer', title: 'Posts'},
        { key: 'AddReelView', title: 'Reels'},
    ]);

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ display: 'none'}}
          style={styles.tabMainContainer(index,mode)}
          labelStyle={styles.lableStyle}
        />
      );
    return (
        <View style={{backgroundColor: 'black',flex: 1}}>
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width, height: 0 }}
            tabBarPosition='bottom'
            renderTabBar={renderTabBar}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    tabMainContainer: (index,mode)=>({
        width: 200,
        height: index===0 && mode === 'gallery' ? 40 : 100,
        borderRadius: 40,
        bottom: index===0 && mode === 'gallery' ? 60 : 0,
        alignSelf: index===0 ? 'flex-end' : 'center',
        backgroundColor: index===0 && mode==='gallery' ? 'rgba(0,0,0,0.7)' : 'black',
    }),
    lableStyle: {
        marginBottom: 30
    }
})

export default PostReelNavigation;
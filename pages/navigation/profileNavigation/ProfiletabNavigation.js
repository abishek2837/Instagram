import * as React from 'react';
import { useWindowDimensions, Image, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProfilePostView from '../../../components/profileComponents/ProfilePostView';
import ProfileReelView from '../../../components/profileComponents/ProfileReelView';
import ProfileTagView from '../../../components/profileComponents/ProfileTagView';

const ProfiletabNavigation = () => {
  const renderScene = SceneMap({
    ProfilePostView: ProfilePostView,
    ProfileReelView: ProfileReelView,
    ProfileTagView: ProfileTagView
  });

  const layout = useWindowDimensions();
  const getTabBarIcon = (props) => {
    const { route, focused } = props
    if (route.key == 'ProfilePostView') {
      return <Image
        style={styles.imageIconStyle}
        source={
          focused ?
            require('../../../assets/images/feedIconActive.png')
            :
            require('../../../assets/images/feedIcon.png')
        }
      />
    }
    else if (route.key == 'ProfileReelView') {
      return <Image
        style={styles.imageIconStyle}
        source={
          focused ?
            require('../../../assets/images/reelIcon.png')
            :
            require('../../../assets/images/reelIconGrey.png')
        }
      />
    }
    else if (route.key == 'ProfileTagView') {
      return <Image style={styles.imageIconStyle}
        source={
          focused ?
            require('../../../assets/images/tagIconActive.png')
            :
            require('../../../assets/images/tagIcon.png')
        }
      />
    }
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white', height: 1 }}
      renderIcon={
        props => getTabBarIcon(props)
      }
      style={{ backgroundColor: 'black', marginTop: 10 }}
      tabStyle={styles.bubble}
      labelStyle={styles.noLabel}
    />
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'ProfilePostView', title: 'first' },
    { key: 'ProfileReelView', title: 'Second' },
    { key: 'ProfileTagView', title: 'third' },
  ]);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  )
}

const styles = StyleSheet.create({
  noLabel: {
    display: 'none',
    height: 0
  },
  imageIconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain'
  }
})
export default ProfiletabNavigation;
import React, { useState } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'

// const icons = [
//     {
//         name: 'Home',
//         active: require('../../assets/images/homeIconActive.png'),
//         inactive: require('../../assets/images/homeIcon.png')
//     },
//     {
//         name: 'Search',
//         active: require('../../assets/images/searchIcon.png'),
//         inactive: require('../../assets/images/searchIcon.png')
//     },
//     {
//         name: 'AddPost',
//         active: require('../../assets/images/addIcon.png'),
//         inactive: require('../../assets/images/addIcon.png')
//     },
//     {
//         name: 'ReelsPost',
//         active: require('../../assets/images/videoIconActive.png'),
//         inactive: require('../../assets/images/videoIcon.png')
//     }
// ]

const FooterTab = ({navigation}) => {
    // const [active, setActive] = useState('Home')
    // const Icon = ({ icon }) => {
    //     return (
    //         <TouchableOpacity onPress={() => {setActive(icon.name),navigation.push(icon.name)}}>
    //             <Image style={styles.commonIconStyle} source={icon.name == active ? icon.active : icon.inactive} />
    //         </TouchableOpacity>
    //     )
    // }
    return (
        // <View style={styles.iconContainer}>
            {/* <TouchableOpacity onPress={() => { setActive('Home') }}>
                <Image style={styles.commonIconStyle} source={icons[0].active} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive('Search')}>
                <Image style={styles.commonIconStyle} source={icons[1].active} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive('Add')}>
                <Image style={styles.commonIconStyle} source={icons[2].active} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive('Video')}>
                <Image style={styles.commonIconStyle} source={icons[3].active} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive('Profile')}>
                <Image style={styles.commonIconStyle} source={icons[4].active} />
            </TouchableOpacity> */}
//             {icons.map((icon, index) => (
//                 <Icon icon={icon} key={index} />
//             ))}
//             <TouchableOpacity onPress={() => {setActive('Profile'),navigation.push('Profile')}}>
//                 <Image
//                     style={[
//                         styles.profileIconStyle(active)
//                     ]}
//                     source={{ uri: 'https://robohash.org/hicveldicta.png' }} />
//             </TouchableOpacity>
//         </View>
    )
}



// const styles = StyleSheet.create({
//     commonIconStyle: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain'
//     },
//     iconContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         margin: 5,
//         marginHorizontal: 10,
//         padding: 5,
//         height: 50
//     },
//     profileIconStyle: (active='profile') => (
//         {
//         width: 30,
//         height: 30,
//         borderColor: 'white',
//         borderWidth: active=='Profile' ? 2 : 0.2,
//         borderRadius: 50
//     })
// })

export default FooterTab;

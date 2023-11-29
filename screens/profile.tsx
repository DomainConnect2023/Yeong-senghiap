import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, Dimensions, Image } from "react-native";
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImagesAssets } from '../objects/images';
import LoginScreen from './loginScreen';
import { css } from '../objects/commonCSS';

const ProfileScreen = () => {
    const navigation = useNavigation();

    useEffect(()=> {
        (async()=> {
            
        })();
    }, [])

    return (
        <MainContainer>
            <View style={[css.mainView,{alignItems: 'center',justifyContent: 'center'}]}>
                <View style={css.HeaderView}>
                    <Text style={css.PageName}>Profile</Text>
                </View>
                <View style={{flexDirection: 'row',}}>
                    <View style={css.listThing}>
                        <Ionicons name="log-out-outline" size={40} color="#FFF" onPress={()=>{[navigation.navigate(LoginScreen as never)]}} />
                    </View>
                </View>
            </View>

            <View style={[css.container]}>
                <Image
                    source={ImagesAssets.comingSoon}
                    style={{width: Dimensions.get("window").width/100*80, height: 250}}
                />
            </View>
        </MainContainer>
    );
}

export default ProfileScreen;
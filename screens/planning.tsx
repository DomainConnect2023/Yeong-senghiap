import React, { useEffect } from 'react';
import { View, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import MainContainer from '../components/MainContainer';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import { css } from '../objects/commonCSS';

const PlanningScreen = () => {
    const navigation = useNavigation();

    useEffect(()=> { // when starting the page
        (async()=> {
            
        })();
    }, []);

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                <View style={css.row}>
                    <Text>Planning</Text>
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
}

export default PlanningScreen;
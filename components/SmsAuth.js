import React, { useRef, useState } from 'react';
import { Text, TouchableHighlight, View, Alert, TextInput, Button } from 'react-native';
import { Form, Item, Input, Label } from 'native-base';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import Modal from "react-native-modal";

//firebase config 
const firebaseConfig = {
    apiKey: "AIzaSyDVhEN_gVpoykSgQR8qHda3MvHIoB4XiEY",
    authDomain: "autostory-clients.firebaseapp.com",
    databaseURL: "https://autostory-clients.firebaseio.com",
    projectId: "autostory-clients",
    storageBucket: "autostory-clients.appspot.com",
    messagingSenderId: "137323679214",
    appId: "1:137323679214:web:d7783835378bd0f6be12ff",
    measurementId: "G-N1TL4NBZS8"
};

// Check firebase.apps to see if its loaded
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function SmsAuth(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [signIn, setSignIn] = useState(false);
    const [code, setCode] = useState('');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [goNextScreenModalVisible, setGoNextScreenModalVisible] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    // send verf code func 
    const sendVerification = () => {

        console.log(userName)
        if (userName.length == 0) {
            alert('Missing name!');
            return;
        }
        if (phoneNumber.length == 0) {
            alert('Missing phone number!');
            return;
        }
        if (password.length == 0) {
            alert('Missing password!');
            return;
        }

        try {
            const bgCode = '+359'; // workaround because Cellular.mobileCountryCode track wrong country code for Bulgaria.
            let phoneNumberRemoveZero = parseInt(phoneNumber, 10);
            const userPhoneNumber = bgCode + phoneNumberRemoveZero;
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            phoneProvider
                .verifyPhoneNumber(userPhoneNumber, recaptchaVerifier.current)
                .then(setVerificationId);
            setConfirmModalVisible(true);
        } catch (err) {
            alert(err);
        }
    };
    // confirm button func
    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
                console.log(result);
                setConfirmModalVisible(false);
                setGoNextScreenModalVisible(true);
            });

    };

    return (
        <View style={styles.container}>

            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <Text style={{ textAlign: 'center', fontSize: 20 }}>Add 6 digit code from sms</Text>
                            <TextInput
                                placeholder=""
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                style={styles.textInput}
                                maxLength={6}
                            />
                        </View>
                        <Button onPress={confirmCode} title="confirmCode" />

                        <TouchableHighlight
                            style={{ ...styles.openButton, position: 'absolute', right: 10, top: 10 }}
                            hitSlop={{ top: 44, bottom: 44, left: 44, right: 44 }}
                            onPress={() => {
                                setConfirmModalVisible(!confirmModalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>X</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={goNextScreenModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{marginBottom:20}}>Registration Successful!</Text>
                        <Button title="Register"  onPress={() => {
                                setGoNextScreenModalVisible(!goNextScreenModalVisible);
                            }} />

                    </View>
                </View>
            </Modal>

            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />

            <View style={styles.textFieldContainerStyle}>
                <Text style={{ fontSize: 26, textAlign: 'center' }}>React Native Expo Firebase SMS Auth</Text>
                <Form>
                    <Item floatingLabel>
                        <Label>Name</Label>
                        <Input onChangeText={setUserName} />
                    </Item>
                    <Item floatingLabel>
                        <Label >Phone</Label>
                        <Input keyboardType="phone-pad" onChangeText={setPhoneNumber} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input autoCapitalize='none' secureTextEntry={true} onChangeText={setPassword} />
                    </Item>
                </Form>

            </View>

            <View style={styles.buttonsContainerStyle}>
                <Button onPress={sendVerification} title="Register" />
            </View>
        </View>
    );
}
const styles = {

    textFieldContainerStyle: {
        alignSelf: 'stretch',
        marginRight: 16,
        marginTop: 5
    },
    container: {
        flex: 1, alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    textInput: {
        marginTop: 50,
        marginBottom: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 5,
    },
    signUpTextStyle: {
        fontSize: 12,
        marginTop: 30,
        marginBottom: 20
    },
    buttonsContainerStyle: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        position: 'absolute',
        bottom: 20,
        width: '100%'
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: 22
    },
    centeredView: {
        flex: 1,
        marginTop: 22
    },
    modalView: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
}

export default SmsAuth;      
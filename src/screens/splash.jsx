import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Loader from '../assets/images/loader.gif';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.splashLoader} source={Loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  splashLoader: {
    height: 200,
    width: 200,
  },
});

export default Splash;
